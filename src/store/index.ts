// Zustand Stores - Application state management

// Authentication store - T011: Create Authentication Store and State Management
export { 
  useAuthStore, 
  useIsAuthenticated, 
  useAuthActions, 
  useAuthLoading, 
  useAuthError 
} from './authStore'
export type { AuthStore, AuthStoreServiceConnectionState } from './authStore'

// Generation store - T016: Create Core Zustand Stores
export {
  useGenerationStore,
  useCurrentPrompt,
  useCurrentSettings,
  useIsGenerating,
  useGenerationProgress,
  useGenerationHistory,
  useSelectedImage,
  useGenerationActions,
  useGenerationError,
  useGenerationStats
} from './generationStore'
export type { GenerationStore } from './generationStore'

// Gallery store - T016: Create Core Zustand Stores
export {
  useGalleryStore,
  useGalleryImages,
  useGalleryCorrectedImages,
  useGalleryVideos,
  useGallerySelection,
  useGalleryView,
  useGalleryFilters,
  useGalleryPagination,
  useGalleryActions,
  useGalleryLoading,
  useGalleryError,
  useGalleryDisplayItems
} from './galleryStore'
export type { GalleryStore } from './galleryStore'

// UI store - T016: Create Core Zustand Stores  
export {
  useUIStore,
  useUILoading,
  useUIToasts,
  useUINavigation,
  useUILayout,
  useUIModal,
  useUITheme,
  useUIPreferences,
  useUIError,
  useUIActions,
  useToastHelpers
} from './uiStore'
export type { UIStore, Toast, UserPreferences } from './uiStore'
