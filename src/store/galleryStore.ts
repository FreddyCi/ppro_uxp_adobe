/**
 * Gallery Store for Image Gallery and History Management
 * Handles image collections, filtering, sorting, and selection
 * Uses Zustand for state management with UXP-compatible local storage persistence
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { GenerationResult } from '../types/firefly'
import type { CorrectedImage } from '../types/gemini'
import type { VideoMetadata } from '../types/blob'
import { storage } from 'uxp'
import { toTempUrl } from '../utils/uxpFs'

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
  // Content collections - enhanced with Azure metadata
  images: GalleryImageWithAzure[]
  correctedImages: CorrectedImage[]
  videos: VideoMetadata[]

  // Selection and view state
  selectedItems: string[]
  viewMode: 'grid' | 'list' | 'details'
  sortBy: 'newest' | 'oldest' | 'prompt' | 'rating' | 'size'
  sortOrder: 'asc' | 'desc'

  // Filtering
  filterTags: string[]
  searchQuery: string
  dateRange: { start?: Date; end?: Date }
  typeFilter: 'all' | 'generated' | 'corrected' | 'videos'

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
    // Content management - enhanced for Azure
    addImage: (image: GalleryImageWithAzure) => void
    addCorrectedImage: (image: CorrectedImage) => void
    addVideo: (video: VideoMetadata) => void
    removeImage: (id: string) => void
    removeCorrectedImage: (id: string) => void
    removeVideo: (id: string) => void
    updateImage: (id: string, updates: Partial<GalleryImageWithAzure>) => void
    updateImageAzureMetadata: (
      id: string,
      azureMetadata: AzureBlobMetadata
    ) => void

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
      filter: 'all' | 'generated' | 'corrected' | 'videos'
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
}

// UXP-compatible storage implementation with localStorage
const createUXPStorage = () => {
  return createJSONStorage(() => localStorage)
}

// Initial state
const initialState = {
  images: [],
  correctedImages: [],
  videos: [],
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

// Union type for all gallery items
type GalleryItem = GalleryImageWithAzure | CorrectedImage | VideoMetadata

// Helper function to get all items based on type filter
const getAllItems = (
  state: Pick<
    GalleryStore,
    'images' | 'correctedImages' | 'videos' | 'typeFilter'
  >
): GalleryItem[] => {
  switch (state.typeFilter) {
    case 'generated':
      return state.images
    case 'corrected':
      return state.correctedImages
    case 'videos':
      return state.videos
    case 'all':
    default:
      return [...state.images, ...state.correctedImages, ...state.videos]
  }
}

// Helper function to filter items based on search and filters
const filterItems = (
  items: GalleryItem[],
  state: Pick<GalleryStore, 'searchQuery' | 'filterTags' | 'dateRange'>
): GalleryItem[] => {
  let filtered = items

  // Search query filter
  if (state.searchQuery.trim()) {
    const query = state.searchQuery.toLowerCase()
    filtered = filtered.filter(item => {
      // Search in prompt/title based on item type
      let searchText = ''
      if ('metadata' in item && item.metadata) {
        // For GenerationResult, metadata has prompt
        if ('prompt' in item.metadata) {
          searchText = item.metadata.prompt
        }
      }
      // For VideoMetadata, search in filename or originalName
      if ('originalName' in item) {
        searchText = item.originalName || searchText
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
      // For VideoMetadata and similar types that extend BaseMetadata
      const itemTags = 'tags' in item ? item.tags || [] : []
      return state.filterTags.every(tag => itemTags.includes(tag))
    })
  }

  return filtered
}

// Helper function to sort items
const sortItems = (
  items: GalleryItem[],
  sortBy: GalleryStore['sortBy'],
  sortOrder: GalleryStore['sortOrder']
): GalleryItem[] => {
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
        aValue = ''
        bValue = ''
        if ('metadata' in a && a.metadata && 'prompt' in a.metadata) {
          aValue = a.metadata.prompt || ''
        } else if ('originalName' in a) {
          aValue = a.originalName || ''
        }
        if ('metadata' in b && b.metadata && 'prompt' in b.metadata) {
          bValue = b.metadata.prompt || ''
        } else if ('originalName' in b) {
          bValue = b.originalName || ''
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
        // Default to 0 for size comparison
        aValue = 0
        bValue = 0
        // Note: Size sorting can be implemented when metadata interfaces are clarified
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
        // Content management
        addImage(image: GalleryImageWithAzure): void {
          set(state => {
            // No automatic quota checking - manual cleanup only

            const newImages = [image, ...state.images]
            return {
              images: newImages,
              totalItems: getAllItems({ ...state, images: newImages }).length,
            }
          })
        },

        addCorrectedImage(image: CorrectedImage): void {
          set(state => {
            // No automatic quota checking - manual cleanup only

            const newCorrectedImages = [image, ...state.correctedImages]
            return {
              correctedImages: newCorrectedImages,
              totalItems: getAllItems({
                ...state,
                correctedImages: newCorrectedImages,
              }).length,
            }
          })
        },

        addVideo(video: VideoMetadata): void {
          set(state => {
            const newVideos = [video, ...state.videos]
            return {
              videos: newVideos,
              totalItems: getAllItems({ ...state, videos: newVideos }).length,
            }
          })
        },

        removeImage(id: string): void {
          set(state => {
            const newImages = state.images.filter(img => img.id !== id)
            const newSelectedItems = state.selectedItems.filter(
              itemId => itemId !== id
            )
            return {
              images: newImages,
              selectedItems: newSelectedItems,
              totalItems: getAllItems({ ...state, images: newImages }).length,
            }
          })
        },

        removeCorrectedImage(id: string): void {
          set(state => {
            const newCorrectedImages = state.correctedImages.filter(
              img => img.id !== id
            )
            const newSelectedItems = state.selectedItems.filter(
              itemId => itemId !== id
            )
            return {
              correctedImages: newCorrectedImages,
              selectedItems: newSelectedItems,
              totalItems: getAllItems({
                ...state,
                correctedImages: newCorrectedImages,
              }).length,
            }
          })
        },

        removeVideo(id: string): void {
          set(state => {
            const newVideos = state.videos.filter(video => video.id !== id)
            const newSelectedItems = state.selectedItems.filter(
              itemId => itemId !== id
            )
            return {
              videos: newVideos,
              selectedItems: newSelectedItems,
              totalItems: getAllItems({ ...state, videos: newVideos }).length,
            }
          })
        },

        updateImage(id: string, updates: Partial<GalleryImageWithAzure>): void {
          set(state => ({
            images: state.images.map(img =>
              img.id === id ? { ...img, ...updates } : img
            ),
          }))
        },

        updateImageAzureMetadata(
          id: string,
          azureMetadata: AzureBlobMetadata
        ): void {
          set(state => ({
            images: state.images.map(img =>
              img.id === id ? { ...img, azureMetadata } : img
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
          const allIds = allItems.map((item: GalleryItem) => item.id)
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

        setSortBy(
          sort: 'newest' | 'oldest' | 'prompt' | 'rating' | 'size'
        ): void {
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

        setTypeFilter(
          filter: 'all' | 'generated' | 'corrected' | 'videos'
        ): void {
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
            // Try to remove from each collection
            state.actions.removeImage(id)
            state.actions.removeCorrectedImage(id)
            state.actions.removeVideo(id)
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

        tagSelected(_tags: string[]): void {
          // TODO: Update GenerationResult type to include tags property
          // const state = get()
          // const { selectedItems } = state
          // // Update images with new tags
          // set((currentState) => ({
          //   images: currentState.images.map(img =>
          //     selectedItems.includes(img.id)
          //       ? { ...img, tags: [...(img.tags || []), ...tags] }
          //       : img
          //   )
          // }))
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
              // Convert images to base64 data URLs for reliable display
              const base64ConvertedItems = await Promise.all(
                syncedItems.map(async (item) => {
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
                    else if (item.localFilePath) {
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
                      return {
                        ...item,
                        correctedUrl: dataUrl,
                        thumbnailUrl: dataUrl,
                      }
                    } else {
                      console.warn('⚠️ Skipping item due to failed base64 conversion:', item.filename)
                      return null
                    }
                  } catch (error) {
                    console.warn('❌ Failed to convert image to base64:', item.filename, error)
                    return null
                  }
                })
              )

              // Filter out null items (failed conversions)
              const validConvertedItems = base64ConvertedItems.filter((item): item is NonNullable<typeof item> => item !== null) as CorrectedImage[]
              console.warn(`📊 After base64 conversion: ${validConvertedItems.length} valid items`)

              // Add new items to gallery, avoiding duplicates
              const state = get()
              const existingIds = new Set([
                ...state.images.map(img => img.id),
                ...state.correctedImages.map(img => img.id)
              ])
              console.warn(`🆔 Existing IDs in gallery:`, Array.from(existingIds))

              const newCorrectedImages = validConvertedItems.filter(item => !existingIds.has(item.id))
              console.warn(`➕ New items to add: ${newCorrectedImages.length}`)
              newCorrectedImages.forEach((item, index) => {
                console.warn(`  ${index + 1}. ${item.filename} (ID: ${item.id})`)
              })

              if (newCorrectedImages.length > 0) {
                set((state: GalleryStore) => ({
                  correctedImages: [...newCorrectedImages, ...state.correctedImages],
                  totalItems: getAllItems({
                    ...state,
                    correctedImages: [...newCorrectedImages, ...state.correctedImages]
                  }).length,
                }))
                console.warn(`✅ Synced ${newCorrectedImages.length} local files to gallery with base64 URLs`)
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
            images: [],
            correctedImages: [],
            videos: [],
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

      // Persist essential data with quota management for corrected images
      partialize: state => ({
        images: state.images,
        correctedImages: state.correctedImages, // Re-enabled with quota management
        videos: state.videos,
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
  return useGalleryStore(state => state.images)
}

export const useGalleryCorrectedImages = () => {
  return useGalleryStore(state => state.correctedImages)
}

export const useGalleryVideos = () => {
  return useGalleryStore(state => state.videos)
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

// Hook to get filtered and sorted items for display
export const useGalleryDisplayItems = () => {
  return useGalleryStore(state => {
    const allItems = getAllItems(state)
    const filtered = filterItems(allItems, state)
    const sorted = sortItems(filtered, state.sortBy, state.sortOrder)

    // Apply pagination
    const startIndex = (state.currentPage - 1) * state.itemsPerPage
    const endIndex = startIndex + state.itemsPerPage
    const paginatedItems = sorted.slice(startIndex, endIndex)

    return {
      items: paginatedItems,
      totalItems: sorted.length,
      currentPage: state.currentPage,
      totalPages: Math.ceil(sorted.length / state.itemsPerPage),
    }
  })
}

// Hydrate gallery items with temporary URLs for local files
export async function loadGalleryItems(rawItems: GalleryItem[]): Promise<GalleryItem[]> {
  return Promise.all(
    rawItems.map(async it => {
      // Skip hydration if item already has a data URL (from base64 conversion)
      if (('correctedUrl' in it && it.correctedUrl?.startsWith('data:')) ||
          ('thumbnailUrl' in it && it.thumbnailUrl?.startsWith('data:')) ||
          ('imageUrl' in it && it.imageUrl?.startsWith('data:'))) {
        console.log('Skipping hydration for item with existing data URL:', it.id)
        return it
      }

      // For corrected images with local storage
      if ('storageMode' in it && it.storageMode === 'local' && 'folderToken' in it && 'relativePath' in it && it.folderToken && it.relativePath) {
        try {
          const src = await toTempUrl(it.folderToken, it.relativePath, undefined, it.localFilePath);
          return { ...it, correctedUrl: src, thumbnailUrl: src }
        } catch (e) {
          console.warn('Failed to create temporary URL for local corrected image', it.relativePath, e)
          // Fall back to blob URL if available
          if ('blobUrl' in it && it.blobUrl) {
            console.warn('Using blob URL fallback for corrected image', it.relativePath)
            return { ...it, correctedUrl: it.blobUrl, thumbnailUrl: it.blobUrl }
          }
          return { ...it, broken: true }
        }
      }
      // For items with localFilePath but no folderToken/relativePath (fallback)
      else if ('localFilePath' in it && it.localFilePath && 'storageMode' in it && it.storageMode === 'local') {
        try {
          const src = await toTempUrl(undefined, undefined, undefined, it.localFilePath);
          return { ...it, correctedUrl: src, thumbnailUrl: src, imageUrl: src }
        } catch (e) {
          console.warn('Failed to create temporary URL for local file using localFilePath', it.localFilePath, e)
          // Fall back to blob URL if available
          if ('blobUrl' in it && it.blobUrl) {
            console.warn('Using blob URL fallback for local file', it.localFilePath)
            return { ...it, correctedUrl: it.blobUrl, thumbnailUrl: it.blobUrl, imageUrl: it.blobUrl }
          }
          return { ...it, broken: true }
        }
      }
      // For generation results with local storage
      else if ('metadata' in it && it.metadata && 'storageMode' in it.metadata && it.metadata.storageMode === 'local' && 'folderToken' in it.metadata && 'relativePath' in it.metadata && it.metadata.folderToken && it.metadata.relativePath) {
        try {
          // Resolve proper MIME type for blob creation
          let mimeType = it.metadata.contentType;
          if (mimeType === 'video') {
            // Infer specific video MIME type from file extension
            const extension = it.metadata.relativePath.split('.').pop()?.toLowerCase();
            switch (extension) {
              case 'mp4':
                mimeType = 'video/mp4';
                break;
              case 'webm':
                mimeType = 'video/webm';
                break;
              case 'avi':
                mimeType = 'video/avi';
                break;
              case 'mov':
                mimeType = 'video/quicktime';
                break;
              case 'mkv':
                mimeType = 'video/x-matroska';
                break;
              case 'm4v':
                mimeType = 'video/x-m4v';
                break;
              default:
                mimeType = 'video/mp4'; // Default fallback
            }
          }
          const src = await toTempUrl(it.metadata.folderToken, it.metadata.relativePath, mimeType, it.metadata.localFilePath);
          return { ...it, imageUrl: src };
        } catch (e) {
          console.warn('Failed to create temporary URL for local generated image', it.metadata.relativePath, e)
          return { ...it, broken: true }
        }
      }
      // For generation results with localFilePath but no folderToken/relativePath (fallback)
      else if ('metadata' in it && it.metadata && 'storageMode' in it.metadata && it.metadata.storageMode === 'local' && 'localFilePath' in it.metadata && it.metadata.localFilePath) {
        try {
          // Resolve proper MIME type for blob creation
          let mimeType = it.metadata.contentType;
          if (mimeType === 'video') {
            // Infer specific video MIME type from file extension
            const extension = it.metadata.localFilePath.split('.').pop()?.toLowerCase();
            switch (extension) {
              case 'mp4':
                mimeType = 'video/mp4';
                break;
              case 'webm':
                mimeType = 'video/webm';
                break;
              case 'avi':
                mimeType = 'video/avi';
                break;
              case 'mov':
                mimeType = 'video/quicktime';
                break;
              case 'mkv':
                mimeType = 'video/x-matroska';
                break;
              case 'm4v':
                mimeType = 'video/x-m4v';
                break;
              default:
                mimeType = 'video/mp4'; // Default fallback
            }
          }
          const src = await toTempUrl(undefined, undefined, mimeType, it.metadata.localFilePath);
          return { ...it, imageUrl: src };
        } catch (e) {
          console.warn('Failed to create temporary URL for local generated image using localFilePath', it.metadata.localFilePath, e)
          return { ...it, broken: true }
        }
      }
      return it // Cloud items already have durable URLs
    })
  )
}

// Scan local storage directory for metadata files and load corrected images
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
          id: metadata.id
        })

        // Check if this is a Gemini-corrected image
        if (metadata.filename && metadata.filename.includes('gemini-corrected')) {
          console.warn(`✅ Found Gemini-corrected image: ${metadata.filename}`)

          // Skip if we don't have the required metadata for display
          if (!metadata.relativePath && !metadata.blobUrl && !metadata.correctedUrl) {
            console.warn('⚠️ Skipping metadata file missing required paths:', metadata.filename)
            continue
          }

          // Use consistent ID based on filename if metadata doesn't have one
          const consistentId = metadata.id || `corrected-${metadata.filename}`

          // Skip if we've already processed this ID in this sync
          if (processedIds.has(consistentId)) {
            console.warn(`⚠️ Skipping duplicate ID within sync: ${consistentId}`)
            continue
          }

          console.warn(`🆔 Using ID: ${consistentId} for ${metadata.filename}`)
          processedIds.add(consistentId)

          // Create default corrections if not present in metadata
          const defaultCorrections = {
            lineCleanup: true,
            enhanceDetails: true,
            noiseReduction: true,
          };

          // Create CorrectedImage from metadata
          const correctedImage: CorrectedImage = {
            id: consistentId,
            originalUrl: metadata.originalUrl || '',
            correctedUrl: '', // Will be set by loadGalleryItems
            thumbnailUrl: '', // Will be set by loadGalleryItems
            corrections: metadata.corrections || defaultCorrections,
            metadata: {
              corrections: metadata.corrections || defaultCorrections,
              originalSize: metadata.originalSize || { width: 0, height: 0, aspectRatio: 1 },
              correctedSize: metadata.correctedSize || { width: 0, height: 0, aspectRatio: 1 },
              model: metadata.model || 'gemini-2.5-flash-image-preview',
              version: metadata.version || 'v1beta',
              processingTime: metadata.processingTime || 0,
              timestamp: new Date(metadata.timestamp || metadata.savedAt || Date.now()),
              operationsApplied: metadata.operationsApplied || ['lineCleanup', 'enhanceDetails', 'noiseReduction'],
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
          console.warn(`➕ Added corrected image to sync list: ${metadata.filename}`)
        } else {
          console.warn(`⏭️ Skipping non-Gemini file: ${metadata.filename || metadataFile.name}`)
        }
      } catch (error) {
        console.warn('❌ Failed to parse metadata file:', metadataFile.name, error)
      }
    }

    console.warn(`📊 Final sync result: ${syncedItems.length} corrected images found`)
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

export default useGalleryStore
