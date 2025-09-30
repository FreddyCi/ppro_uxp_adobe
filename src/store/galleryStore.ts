/**
 * Gallery Store for Image Gallery and History Management
 * Handles image collections, filtering, sorting, and selection
 * Uses Zustand for state management with UXP-compatible local storage persistence
 */

import { useCallback } from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { GenerationResult } from '../types/firefly'
import type { CorrectedImage } from '../types/gemini'
import type { VideoMetadata } from '../types/blob'
import type { ContentItem, ContentType } from '../types/content'
import {
  convertGenerationResultToContentItem,
  convertCorrectedImageToContentItem,
  convertVideoMetadataToContentItem
} from '../types/content'
import { storage } from 'uxp'
import { refreshContentItemUrls } from '../utils/blobUrlLifecycle'

// Utility function to convert blob to base64 data URL
async function blobToDataUrl(blob: Blob): Promise<string> {
  try {
    const arrayBuffer = await blob.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    const base64 = encodeBase64(bytes)
    const mimeType = blob.type || 'application/octet-stream'

    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error('Failed to convert blob to data URL:', error)
    throw error
  }
}

// Utility function to encode bytes to base64
function encodeBase64(bytes: Uint8Array): string {
  if (typeof btoa === 'function') {
    let binary = ''
    const chunkSize = 0x8000
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize)
      binary += Array.from(chunk, byte => String.fromCharCode(byte)).join('')
    }
    return btoa(binary)
  }

  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let result = ''
  let i = 0

  for (; i + 3 <= bytes.length; i += 3) {
    const triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
    result += base64Chars[(triplet >> 18) & 63]
    result += base64Chars[(triplet >> 12) & 63]
    result += base64Chars[(triplet >> 6) & 63]
    result += base64Chars[triplet & 63]
  }

  if (i < bytes.length) {
    const remaining = bytes.length - i
    const chunk = (bytes[i] << 16) | ((remaining > 1 ? bytes[i + 1] : 0) << 8)
    result += base64Chars[(chunk >> 18) & 63]
    result += base64Chars[(chunk >> 12) & 63]
    if (remaining === 2) {
      result += base64Chars[(chunk >> 6) & 63]
      result += '='
    } else {
      result += '='
      result += '='
    }
  }

  return result
}

// Extended types for Azure Storage integration
export interface AzureBlobMetadata {
  containerName: string
  blobName: string
  sasUrl: string
  expiresAt: Date
  blobUrl: string
  etag?: string
  lastModified?: Date
}

export interface GalleryImageWithAzure extends GenerationResult {
  azureMetadata?: AzureBlobMetadata
}

// Store interface for gallery management
export interface GalleryStore {
  // Unified content collection
  contentItems: ContentItem[]

  // Selection and view state
  selectedItems: string[]
  viewMode: 'grid' | 'list' | 'details'
  sortBy: 'newest' | 'oldest' | 'prompt' | 'rating' | 'size'
  sortOrder: 'asc' | 'desc'

  // Filtering
  filterTags: string[]
  searchQuery: string
  dateRange: { start?: Date; end?: Date }
  typeFilter: 'all' | 'generated' | 'corrected' | 'videos' | 'images'

  // Pagination
  currentPage: number
  itemsPerPage: number
  totalItems: number

  // Loading and error states
  isLoading: boolean
  error: string | null
  lastRefresh: Date | null

  // Actions
  actions: {
    // Content management - unified
    addContentItem: (item: ContentItem) => void
    removeContentItem: (id: string) => void
    updateContentItem: (id: string, updates: Partial<ContentItem>) => void

    // Selection management
    selectItems: (ids: string[], append?: boolean) => void
    selectAll: () => void
    clearSelection: () => void
    toggleSelection: (id: string) => void

    // View and display
    setViewMode: (mode: 'grid' | 'list' | 'details') => void
    setSortBy: (
      sort: 'newest' | 'oldest' | 'prompt' | 'rating' | 'size'
    ) => void
    setSortOrder: (order: 'asc' | 'desc') => void

    // Filtering and search
    setFilterTags: (tags: string[]) => void
    addFilterTag: (tag: string) => void
    removeFilterTag: (tag: string) => void
    setSearchQuery: (query: string) => void
    setDateRange: (range: { start?: Date; end?: Date }) => void
    setTypeFilter: (
      filter: 'all' | 'generated' | 'corrected' | 'videos' | 'images'
    ) => void
    clearFilters: () => void

    // Pagination
    setPage: (page: number) => void
    setItemsPerPage: (count: number) => void

    // Bulk operations
    deleteSelected: () => void
    exportSelected: () => Promise<void>
    tagSelected: (tags: string[]) => void

    // Data management
    refreshGallery: () => Promise<void>
    syncLocalFiles: () => Promise<void>
    clearAll: () => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
  }
}// UXP-compatible storage implementation with localStorage
const createUXPStorage = () => {
  return createJSONStorage(() => localStorage)
}

// Initial state
const initialState = {
  contentItems: [],
  selectedItems: [],
  viewMode: 'grid' as const,
  sortBy: 'newest' as const,
  sortOrder: 'desc' as const,
  filterTags: [],
  searchQuery: '',
  dateRange: {},
  typeFilter: 'all' as const,
  currentPage: 1,
  itemsPerPage: 20,
  totalItems: 0,
  isLoading: false,
  error: null,
  lastRefresh: null,
}

// Helper function to get all items based on type filter
export const getAllItems = (
  state: Pick<GalleryStore, 'contentItems' | 'typeFilter'>
): ContentItem[] => {
  switch (state.typeFilter) {
    case 'generated':
      return state.contentItems.filter(item =>
        item.contentType === 'generated-image' || item.contentType === 'uploaded-image'
      )
    case 'corrected':
      return state.contentItems.filter(item => item.contentType === 'corrected-image')
    case 'videos':
      return state.contentItems.filter(item =>
        item.contentType === 'video' || item.contentType === 'uploaded-video'
      )
    case 'images':
      return state.contentItems.filter(item =>
        ['generated-image', 'corrected-image', 'uploaded-image'].includes(item.contentType)
      )
    case 'all':
    default:
      return state.contentItems
  }
}

// Helper function to filter items based on search and filters
export const filterItems = (
  items: ContentItem[],
  state: Pick<GalleryStore, 'searchQuery' | 'filterTags' | 'dateRange'>
): ContentItem[] => {
  let filtered = items

  // Search query filter
  if (state.searchQuery.trim()) {
    const query = state.searchQuery.toLowerCase()
    filtered = filtered.filter(item => {
      // Search based on content type
      let searchText = item.filename || item.originalName

      // For generated images, search in prompt
      if (item.contentType === 'generated-image') {
        const genData = item.content as import('../types/content').GeneratedImageData
        searchText = genData.prompt || searchText
      }

      return searchText.toLowerCase().includes(query)
    })
  }

  // Date range filter
  if (state.dateRange.start || state.dateRange.end) {
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.timestamp)
      const afterStart =
        !state.dateRange.start || itemDate >= state.dateRange.start
      const beforeEnd = !state.dateRange.end || itemDate <= state.dateRange.end
      return afterStart && beforeEnd
    })
  }

  // Tags filter
  if (state.filterTags.length > 0) {
    filtered = filtered.filter(item => {
      return state.filterTags.every(tag => item.tags.includes(tag))
    })
  }

  return filtered
}

// Helper function to sort items
export const sortItems = (
  items: ContentItem[],
  sortBy: GalleryStore['sortBy'],
  sortOrder: GalleryStore['sortOrder']
): ContentItem[] => {
  const sorted = [...items].sort((a, b) => {
    let aValue: string | number | Date
    let bValue: string | number | Date

    switch (sortBy) {
      case 'newest':
      case 'oldest':
        aValue = new Date(a.timestamp).getTime()
        bValue = new Date(b.timestamp).getTime()
        break
      case 'prompt':
        // Get search text for sorting
        aValue = a.filename || a.originalName || ''
        bValue = b.filename || b.originalName || ''

        // For generated images, use prompt
        if (a.contentType === 'generated-image') {
          const genData = a.content as import('../types/content').GeneratedImageData
          aValue = genData.prompt || aValue
        }
        if (b.contentType === 'generated-image') {
          const genData = b.content as import('../types/content').GeneratedImageData
          bValue = genData.prompt || bValue
        }

        aValue = (aValue as string).toLowerCase()
        bValue = (bValue as string).toLowerCase()
        break
      case 'rating':
        // Rating is optional property, default to 0
        aValue = 0
        bValue = 0
        break
      case 'size':
        // Use file size for sorting
        aValue = a.size || 0
        bValue = b.size || 0
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  // For 'oldest' sort, reverse the array after sorting by timestamp
  if (sortBy === 'oldest') {
    return sorted.reverse()
  }

  return sorted
}

// Create the gallery store
export const useGalleryStore = create<GalleryStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      actions: {
        // Unified content management
        addContentItem(item: ContentItem): void {
          set(state => {
            const newContentItems = [item, ...state.contentItems]
            return {
              contentItems: newContentItems,
              totalItems: getAllItems({ ...state, contentItems: newContentItems }).length,
            }
          })
        },

        removeContentItem(id: string): void {
          set(state => {
            const newContentItems = state.contentItems.filter(item => item.id !== id)
            const newSelectedItems = state.selectedItems.filter(itemId => itemId !== id)
            return {
              contentItems: newContentItems,
              selectedItems: newSelectedItems,
              totalItems: getAllItems({ ...state, contentItems: newContentItems }).length,
            }
          })
        },

        updateContentItem(id: string, updates: Partial<ContentItem>): void {
          set(state => ({
            contentItems: state.contentItems.map(item =>
              item.id === id ? { ...item, ...updates } : item
            ),
          }))
        },

        // Selection management
        selectItems(ids: string[], append = false): void {
          set(state => ({
            selectedItems: append
              ? [...new Set([...state.selectedItems, ...ids])]
              : ids,
          }))
        },

        selectAll(): void {
          const state = get()
          const allItems = getAllItems(state)
          const allIds = allItems.map(item => item.id)
          set({ selectedItems: allIds })
        },

        clearSelection(): void {
          set({ selectedItems: [] })
        },

        toggleSelection(id: string): void {
          set(state => ({
            selectedItems: state.selectedItems.includes(id)
              ? state.selectedItems.filter(itemId => itemId !== id)
              : [...state.selectedItems, id],
          }))
        },

        // View and display
        setViewMode(mode: 'grid' | 'list' | 'details'): void {
          set({ viewMode: mode })
        },

        setSortBy(sort: 'newest' | 'oldest' | 'prompt' | 'rating' | 'size'): void {
          set({ sortBy: sort, currentPage: 1 })
        },

        setSortOrder(order: 'asc' | 'desc'): void {
          set({ sortOrder: order, currentPage: 1 })
        },

        // Filtering and search
        setFilterTags(tags: string[]): void {
          set({ filterTags: tags, currentPage: 1 })
        },

        addFilterTag(tag: string): void {
          set(state => ({
            filterTags: state.filterTags.includes(tag)
              ? state.filterTags
              : [...state.filterTags, tag],
            currentPage: 1,
          }))
        },

        removeFilterTag(tag: string): void {
          set(state => ({
            filterTags: state.filterTags.filter(t => t !== tag),
            currentPage: 1,
          }))
        },

        setSearchQuery(query: string): void {
          set({ searchQuery: query, currentPage: 1 })
        },

        setDateRange(range: { start?: Date; end?: Date }): void {
          set({ dateRange: range, currentPage: 1 })
        },

        setTypeFilter(filter: 'all' | 'generated' | 'corrected' | 'videos' | 'images'): void {
          const state = get()
          set({
            typeFilter: filter,
            currentPage: 1,
            selectedItems: [], // Clear selection when changing filter
            totalItems: getAllItems({ ...state, typeFilter: filter }).length,
          })
        },

        clearFilters(): void {
          set({
            filterTags: [],
            searchQuery: '',
            dateRange: {},
            typeFilter: 'all',
            currentPage: 1,
          })
        },

        // Pagination
        setPage(page: number): void {
          set({ currentPage: Math.max(1, page) })
        },

        setItemsPerPage(count: number): void {
          set({ itemsPerPage: Math.max(1, count), currentPage: 1 })
        },

        // Bulk operations
        deleteSelected(): void {
          const state = get()
          const { selectedItems } = state
          selectedItems.forEach(id => {
            this.removeContentItem(id)
          })
          set({ selectedItems: [] })
        },

        async exportSelected(): Promise<void> {
          const state = get()
          // TODO: Implement actual export logic
          // This would integrate with the blob service for actual export
          if (state.selectedItems.length > 0) {
            // Placeholder for export implementation
          }
        },

        tagSelected(tags: string[]): void {
          const state = get()
          const { selectedItems } = state
          // Update content items with new tags
          set(state => ({
            contentItems: state.contentItems.map(item =>
              selectedItems.includes(item.id)
                ? { ...item, tags: [...new Set([...item.tags, ...tags])] }
                : item
            ),
          }))
        },

        // Data management
        async refreshGallery(): Promise<void> {
          set({ isLoading: true, error: null })

          try {
            // TODO: Implement actual refresh logic
            // This would fetch updated data from services

            set({
              isLoading: false,
              lastRefresh: new Date(),
              error: null,
            })
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : 'Failed to refresh gallery'
            set({
              isLoading: false,
              error: errorMessage,
            })
          }
        },

        async syncLocalFiles(): Promise<void> {
          set({ isLoading: true, error: null })

          try {
            const syncedItems = await scanAndLoadLocalFiles()
            console.warn(`🔄 Starting sync with ${syncedItems.length} raw items from scan`)

            if (syncedItems.length > 0) {
              // Convert legacy CorrectedImage items to unified ContentItem format
              const contentItems = syncedItems.map(item => {
                // Determine content type based on metadata
                let contentType: ContentType = 'corrected-image' // default

                // Check raw metadata properties (not typed)
                const rawMetadata = item.metadata as any
                if (item.filename?.includes('ltx-') || rawMetadata?.model === 'ltx-video') {
                  contentType = 'video'
                } else if (item.filename?.includes('luma-') || (rawMetadata?.model && rawMetadata.model.includes('ray'))) {
                  contentType = 'video'
                } else if (item.filename?.includes('gemini-corrected')) {
                  contentType = 'corrected-image'
                } else if (rawMetadata?.contentType === 'video') {
                  contentType = 'video'
                } else if (rawMetadata?.contentType === 'generated-image') {
                  contentType = 'generated-image'
                }

                // Create ContentItem based on detected type
                if (contentType === 'video') {
                  return {
                    // Base metadata
                    id: item.id,
                    filename: item.filename,
                    originalName: item.filename,
                    mimeType: 'video/mp4', // Assume MP4 for videos
                    size: 0, // Size not available in legacy metadata
                    tags: [],
                    timestamp: item.timestamp,
                    userId: undefined,
                    sessionId: undefined,

                    // Type and display
                    contentType: 'video',
                    displayUrl: '', // Will be set by base64 conversion
                    thumbnailUrl: item.thumbnailUrl || '', // Use stored thumbnail
                    blobUrl: item.blobUrl,
                    localPath: item.localFilePath,
                    localMetadataPath: item.localMetadataPath,

                    // Content data for video
                    content: {
                      type: 'video',
                      videoUrl: '', // Will be set by base64 conversion
                      duration: rawMetadata?.processingTime || 0, // Approximate duration
                      fps: 30, // Default FPS
                      resolution: { width: 1920, height: 1080 }, // Default resolution
                      codec: 'h264',
                      hasAudio: true,
                      audioCodec: 'aac'
                    },

                    // Storage
                    storageMode: 'local',
                    persistenceMethod: 'local',
                    folderToken: item.folderToken,
                    relativePath: item.relativePath,

                    // Status
                    status: 'ready'
                  } as ContentItem
                } else if (contentType === 'generated-image') {
                  return {
                    // Base metadata
                    id: item.id,
                    filename: item.filename,
                    originalName: item.filename,
                    mimeType: 'image/jpeg',
                    size: 0,
                    tags: [],
                    timestamp: item.timestamp,
                    userId: undefined,
                    sessionId: undefined,

                    // Type and display
                    contentType: 'generated-image',
                    displayUrl: '', // Will be set by base64 conversion
                    thumbnailUrl: item.thumbnailUrl || '',
                    blobUrl: item.blobUrl,
                    localPath: item.localFilePath,
                    localMetadataPath: item.localMetadataPath,

                    // Content data for generated image
                    content: {
                      type: 'generated-image',
                      imageUrl: '',
                      seed: rawMetadata?.seed || 0,
                      generationMetadata: {
                        prompt: rawMetadata?.operationsApplied?.join(' ') || 'Generated image',
                        contentType: 'image/jpeg',
                        resolution: { width: 1024, height: 1024 },
                        fileSize: 0,
                        timestamp: item.timestamp.getTime(), // Convert Date to number
                        userId: '',
                        sessionId: '',
                        filename: item.filename,
                        seed: rawMetadata?.seed || 0,
                        jobId: item.id,
                        model: rawMetadata?.model || 'unknown',
                        version: rawMetadata?.version || 'v1'
                      },
                      prompt: rawMetadata?.operationsApplied?.join(' ') || 'Generated image',
                      size: { width: 1024, height: 1024 }
                    },

                    // Storage
                    storageMode: 'local',
                    persistenceMethod: 'local',
                    folderToken: item.folderToken,
                    relativePath: item.relativePath,

                    // Status
                    status: 'ready'
                  } as ContentItem
                } else {
                  // Default to corrected image
                  return convertCorrectedImageToContentItem(item)
                }
              })

              // Convert images/videos to base64 data URLs for reliable display
              const base64ConvertedItems = await Promise.all(
                contentItems.map(async (item) => {
                  try {
                    let dataUrl = ''

                    // Try to convert blob URL to base64
                    if (item.blobUrl && item.blobUrl.startsWith('blob:')) {
                      console.log('🔄 Converting blob URL to base64 for:', item.filename)
                      const response = await fetch(item.blobUrl)
                      const blob = await response.blob()
                      dataUrl = await blobToDataUrl(blob)
                      console.log('✅ Converted blob to base64 data URL:', dataUrl.substring(0, 50) + '...')
                    }
                    // Try to load from local file path
                    else if (item.localPath) {
                      console.log('🔄 Converting local file to base64 for:', item.filename)
                      // Load the file using UXP filesystem
                      const fs = storage.localFileSystem
                      const folderToken = item.folderToken
                      const relativePath = item.relativePath

                      if (folderToken && relativePath) {
                        try {
                          const folder = await fs.getEntryForPersistentToken(folderToken)
                          const file = await folder.getEntry(relativePath)
                          const arrayBuffer = await file.read()
                          const blob = new Blob([arrayBuffer])
                          dataUrl = await blobToDataUrl(blob)
                          console.log('✅ Converted local file to base64 data URL:', dataUrl.substring(0, 50) + '...')
                        } catch (fileError) {
                          console.warn('❌ Failed to load local file for base64 conversion:', fileError)
                        }
                      }
                    }

                    // Only return the item if conversion succeeded
                    if (dataUrl) {
                      if (item.contentType === 'video') {
                        return {
                          ...item,
                          displayUrl: dataUrl,
                          thumbnailUrl: item.thumbnailUrl || dataUrl, // Use dataUrl as thumbnail if none exists
                          content: {
                            ...item.content,
                            videoUrl: dataUrl
                          }
                        }
                      } else {
                        return {
                          ...item,
                          displayUrl: dataUrl,
                          thumbnailUrl: item.thumbnailUrl || dataUrl
                        }
                      }
                    } else {
                      console.warn('⚠️ Skipping item due to failed base64 conversion:', item.filename)
                      return null
                    }
                  } catch (error) {
                    console.warn('❌ Failed to convert item to base64:', item.filename, error)
                    return null
                  }
                })
              )

              // Filter out null items (failed conversions)
              const validConvertedItems = base64ConvertedItems.filter((item): item is NonNullable<typeof item> => item !== null)
              console.warn(`📊 After base64 conversion: ${validConvertedItems.length} valid items`)

              // Add new items to gallery, avoiding duplicates
              const state = get()
              const existingIds = new Set(state.contentItems.map(item => item.id))
              console.warn(`🆔 Existing IDs in gallery:`, Array.from(existingIds))

              const newContentItems = validConvertedItems.filter(item => !existingIds.has(item.id))
              console.warn(`➕ New items to add: ${newContentItems.length}`)
              newContentItems.forEach((item, index) => {
                console.warn(`  ${index + 1}. ${item.filename} (ID: ${item.id}, Type: ${item.contentType})`)
              })

              if (newContentItems.length > 0) {
                set((state: GalleryStore) => ({
                  contentItems: [...newContentItems, ...state.contentItems],
                  totalItems: getAllItems({
                    ...state,
                    contentItems: [...newContentItems, ...state.contentItems]
                  }).length,
                }))
                console.warn(`✅ Synced ${newContentItems.length} local files to gallery with base64 URLs`)
              } else {
                console.warn('ℹ️ No new local files to sync')
              }
            }

            set({
              isLoading: false,
              lastRefresh: new Date(),
              error: null,
            })
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : 'Failed to sync local files'
            console.error('❌ Sync local files failed:', error)
            set({
              isLoading: false,
              error: errorMessage,
            })
          }
        },

        clearAll(): void {
          set({
            contentItems: [],
            selectedItems: [],
            totalItems: 0,
            currentPage: 1,
          })
        },

        setLoading(loading: boolean): void {
          set({ isLoading: loading })
        },

        setError(error: string | null): void {
          set({ error })
        },
      },
    }),
    {
      name: 'gallery-storage', // localStorage key
      storage: createUXPStorage(),

      // Persist essential data with quota management for content items
      partialize: state => ({
        contentItems: state.contentItems,
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        itemsPerPage: state.itemsPerPage,
        filterTags: state.filterTags,
        // Don't persist loading states, errors, or selection
      }),

      // Handle rehydration
      onRehydrateStorage: () => state => {
        if (state) {
          // Reset transient state on rehydration
          state.selectedItems = []
          state.isLoading = false
          state.error = null
          state.currentPage = 1
          state.searchQuery = ''
          state.dateRange = {}
          state.lastRefresh = null

          // Recalculate total items
          state.totalItems = getAllItems(state).length
        }
      },

      // Handle storage version changes
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // Migration from v0 to v1 if needed
          return persistedState
        }
        return persistedState
      },
    }
  )
)

// Convenience hooks for specific state slices
export const useGalleryImages = () => {
  return useGalleryStore(state => state.contentItems.filter(item =>
    item.contentType === 'generated-image' || item.contentType === 'uploaded-image'
  ))
}

export const useGalleryCorrectedImages = () => {
  return useGalleryStore(state => state.contentItems.filter(item =>
    item.contentType === 'corrected-image'
  ))
}

export const useGalleryVideos = () => {
  return useGalleryStore(state => state.contentItems.filter(item =>
    item.contentType === 'video' || item.contentType === 'uploaded-video'
  ))
}

export const useGallerySelection = () => {
  return useGalleryStore(state => ({
    selectedItems: state.selectedItems,
    selectItems: state.actions.selectItems,
    clearSelection: state.actions.clearSelection,
    toggleSelection: state.actions.toggleSelection,
  }))
}

export const useGalleryView = () => {
  return useGalleryStore(state => ({
    viewMode: state.viewMode,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    setViewMode: state.actions.setViewMode,
    setSortBy: state.actions.setSortBy,
    setSortOrder: state.actions.setSortOrder,
  }))
}

export const useGalleryFilters = () => {
  return useGalleryStore(state => ({
    filterTags: state.filterTags,
    searchQuery: state.searchQuery,
    dateRange: state.dateRange,
    typeFilter: state.typeFilter,
    setFilterTags: state.actions.setFilterTags,
    setSearchQuery: state.actions.setSearchQuery,
    setDateRange: state.actions.setDateRange,
    setTypeFilter: state.actions.setTypeFilter,
    clearFilters: state.actions.clearFilters,
  }))
}

export const useGalleryPagination = () => {
  return useGalleryStore(state => ({
    currentPage: state.currentPage,
    itemsPerPage: state.itemsPerPage,
    totalItems: state.totalItems,
    setPage: state.actions.setPage,
    setItemsPerPage: state.actions.setItemsPerPage,
  }))
}

export const useGalleryActions = () => {
  return useGalleryStore(state => state.actions)
}

export const useGalleryLoading = () => {
  return useGalleryStore(state => state.isLoading)
}

export const useGalleryError = () => {
  return useGalleryStore(state => state.error)
}

// Hook to get raw data for display computation
export const useGalleryDisplayItems = () => {
  return useGalleryStore(
    useShallow(
      useCallback(
        (state) => ({
          contentItems: state.contentItems,
          typeFilter: state.typeFilter,
          searchQuery: state.searchQuery,
          filterTags: state.filterTags,
          dateRange: state.dateRange,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
          currentPage: state.currentPage,
          itemsPerPage: state.itemsPerPage
        }),
        []
      )
    )
  )
}

// Scan local storage directory for metadata files and load all generations
async function scanAndLoadLocalFiles(): Promise<CorrectedImage[]> {
  const fs = storage.localFileSystem
  const syncedItems: CorrectedImage[] = []

  try {
    // Get the stored folder token and path
    const folderToken = localStorage.getItem('boltuxp.localFolderToken')
    const folderPath = localStorage.getItem('boltuxp.localFolderPath')

    if (!folderToken || !folderPath) {
      console.warn('No stored folder token or path found for local file sync')
      return syncedItems
    }

    // Get the folder entry using the token
    const folder = await fs.getEntryForPersistentToken(folderToken)
    if (!folder || !folder.isFolder) {
      console.warn('Invalid folder token for local file sync')
      return syncedItems
    }

    // Recursively scan for JSON metadata files
    const metadataFiles = await scanForMetadataFiles(folder)
    console.warn(`🔍 Found ${metadataFiles.length} total JSON files in local storage`)

    // Deduplicate files by native path to prevent processing the same file multiple times
    const uniqueFiles = new Map()
    for (const file of metadataFiles) {
      const path = file.nativePath || file.name
      if (!uniqueFiles.has(path)) {
        uniqueFiles.set(path, file)
      } else {
        console.warn(`⚠️ Duplicate file found and skipped: ${path}`)
      }
    }
    const deduplicatedFiles = Array.from(uniqueFiles.values())
    console.warn(`🔧 After deduplication: ${deduplicatedFiles.length} unique JSON files`)

    // Track processed IDs to prevent duplicates within this sync operation
    const processedIds = new Set<string>()

    for (const metadataFile of deduplicatedFiles) {
      try {
        console.warn(`📄 Processing metadata file: ${metadataFile.name}`)
        // Read and parse metadata file
        const content = await metadataFile.read()
        const metadata = JSON.parse(content)

        console.warn(`📋 Metadata content:`, {
          filename: metadata.filename,
          hasRelativePath: !!metadata.relativePath,
          hasBlobUrl: !!metadata.blobUrl,
          hasCorrectedUrl: !!metadata.correctedUrl,
          contentType: metadata.contentType,
          id: metadata.id
        })

        // Check if this is a supported generation type (Gemini-corrected, LTX video, Luma video, or other generations)
        const isSupportedGeneration = (
          metadata.filename && (
            metadata.filename.includes('gemini-corrected') || // Gemini corrections
            metadata.filename.includes('ltx-') || // LTX videos
            metadata.filename.includes('luma-') || // Luma videos
            metadata.contentType === 'video' || // Any video content
            metadata.contentType === 'generated-image' || // Firefly images
            metadata.contentType === 'corrected-image' // Gemini corrections
          )
        )

        if (isSupportedGeneration) {
          console.warn(`✅ Found supported generation: ${metadata.filename} (${metadata.contentType || 'unknown type'})`)

          // Skip if we don't have the required metadata for display
          if (!metadata.relativePath && !metadata.blobUrl && !metadata.correctedUrl) {
            console.warn('⚠️ Skipping metadata file missing required paths:', metadata.filename)
            continue
          }

          // Use consistent ID based on filename if metadata doesn't have one
          const consistentId = metadata.id || `generation-${metadata.filename}`

          // Skip if we've already processed this ID in this sync
          if (processedIds.has(consistentId)) {
            console.warn(`⚠️ Skipping duplicate ID within sync: ${consistentId}`)
            continue
          }

          console.warn(`🆔 Using ID: ${consistentId} for ${metadata.filename}`)
          processedIds.add(consistentId)

          // Create default corrections if not present in metadata (for Gemini)
          const defaultCorrections = {
            lineCleanup: true,
            enhanceDetails: true,
            noiseReduction: true,
          };

          // Create CorrectedImage from metadata (this will be converted to ContentItem later)
          const correctedImage: CorrectedImage = {
            id: consistentId,
            originalUrl: metadata.originalUrl || '',
            correctedUrl: '', // Will be set by loadGalleryItems
            thumbnailUrl: metadata.thumbnailUrl || '', // Use stored thumbnail if available
            corrections: metadata.corrections || defaultCorrections,
            metadata: {
              corrections: metadata.corrections || defaultCorrections,
              originalSize: metadata.originalSize || { width: 0, height: 0, aspectRatio: 1 },
              correctedSize: metadata.correctedSize || { width: 0, height: 0, aspectRatio: 1 },
              model: metadata.model || (metadata.filename?.includes('ltx') ? 'ltx-video' : metadata.filename?.includes('luma') ? 'luma-dream-machine' : 'unknown'),
              version: metadata.version || 'v1',
              processingTime: metadata.processingTime || 0,
              timestamp: new Date(metadata.timestamp || metadata.savedAt || Date.now()),
              operationsApplied: metadata.operationsApplied || ['generation'],
              resourceUsage: metadata.resourceUsage || { computeTime: 0, memoryUsed: 0 },
            },
            timestamp: new Date(metadata.timestamp || metadata.savedAt || Date.now()),
            blobUrl: metadata.blobUrl || '',
            filename: metadata.filename,
            storageLocation: 'local',
            localFilePath: metadata.filePath,
            localMetadataPath: metadataFile.nativePath || metadataFile.name,
            storageMode: 'local',
            persistenceMethod: 'local',
            folderToken: metadata.folderToken,
            relativePath: metadata.relativePath,
          }

          syncedItems.push(correctedImage)
          console.warn(`➕ Added generation to sync list: ${metadata.filename} (${metadata.contentType || 'unknown'})`)
        } else {
          console.warn(`⏭️ Skipping unsupported file: ${metadata.filename || metadataFile.name} (${metadata.contentType || 'no content type'})`)
        }
      } catch (error) {
        console.warn('❌ Failed to parse metadata file:', metadataFile.name, error)
      }
    }

    console.warn(`📊 Final sync result: ${syncedItems.length} generations found`)
    syncedItems.forEach((item, index) => {
      console.warn(`  ${index + 1}. ${item.filename} (ID: ${item.id})`)
    })
  } catch (error) {
    console.error('❌ Failed to scan local files:', error)
  }

  return syncedItems
}

// Recursively scan directory for .json metadata files
async function scanForMetadataFiles(folder: any): Promise<any[]> {
  const metadataFiles: any[] = []

  try {
    // Get all entries in the folder
    const entries = await folder.getEntries()
    console.warn(`📂 Scanning folder: ${folder.name || folder.nativePath} (${entries.length} entries)`)

    for (const entry of entries) {
      if (entry.isFile && entry.name.endsWith('.json')) {
        console.warn(`📄 Found JSON file: ${entry.name}`)
        metadataFiles.push(entry)
      } else if (entry.isFolder) {
        // Recursively scan subfolders
        console.warn(`📂 Recursing into subfolder: ${entry.name}`)
        const subFiles = await scanForMetadataFiles(entry)
        metadataFiles.push(...subFiles)
      }
    }
  } catch (error) {
    console.warn('❌ Failed to scan folder:', folder.name, error)
  }

  console.warn(`📊 Folder scan complete: ${metadataFiles.length} JSON files found in ${folder.name || folder.nativePath}`)
  return metadataFiles
}
