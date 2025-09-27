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

export default useGalleryStore
