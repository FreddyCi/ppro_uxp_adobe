// Zustand Store State Types
// For application state management

import type { GenerationResult, FireflyRequest, FireflyConfig } from './firefly'
import type { CorrectedImage, GeminiConfig } from './gemini'
import type { VideoMetadata, BlobStorageConfig } from './blob'
import type { PremiereApplicationState, ProjectItem } from './premiere'

// Authentication Store
export interface AuthStore {
  // Authentication state
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  tokenExpiry: number | null
  userId?: string
  
  // Service connections
  services: {
    firefly: ServiceConnectionState
    gemini: ServiceConnectionState
    azureBlob: ServiceConnectionState
    premiere: ServiceConnectionState
  }
  
  // Actions
  actions: {
    setAuth: (token: string, expiry: number, refreshToken?: string) => void
    clearAuth: () => void
    refreshToken: () => Promise<boolean>
    updateServiceConnection: (service: keyof AuthStore['services'], state: ServiceConnectionState) => void
  }
}

export interface ServiceConnectionState {
  connected: boolean
  lastConnected?: Date
  error?: string
  config?: Record<string, unknown>
}

// Generation Store
export interface GenerationStore {
  // Current generation state
  currentPrompt: string
  currentSettings: Partial<FireflyRequest>
  isGenerating: boolean
  generationProgress?: number
  
  // History and results
  generationHistory: GenerationResult[]
  correctionHistory: CorrectedImage[]
  selectedImage: GenerationResult | null
  selectedCorrection: CorrectedImage | null
  
  // Session management
  sessionId: string
  totalGenerations: number
  totalCorrections: number
  
  // Actions
  actions: {
    setPrompt: (prompt: string) => void
    updateSettings: (settings: Partial<FireflyRequest>) => void
    startGeneration: () => void
    addGeneration: (result: GenerationResult) => void
    selectImage: (id: string) => void
    selectCorrection: (id: string) => void
    addCorrection: (correction: CorrectedImage) => void
    clearHistory: () => void
    removeGeneration: (id: string) => void
    removeCorrection: (id: string) => void
    duplicateGeneration: (id: string) => void
    exportToBlob: (id: string) => Promise<string>
  }
}

// Gallery Store
export interface GalleryStore {
  // Content
  images: GenerationResult[]
  correctedImages: CorrectedImage[]
  videos: VideoMetadata[]
  
  // Selection and view
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
  
  // Actions
  actions: {
    addImage: (image: GenerationResult) => void
    addCorrectedImage: (image: CorrectedImage) => void
    addVideo: (video: VideoMetadata) => void
    selectItems: (ids: string[], append?: boolean) => void
    clearSelection: () => void
    setViewMode: (mode: 'grid' | 'list' | 'details') => void
    setSortBy: (sort: 'newest' | 'oldest' | 'prompt' | 'rating' | 'size') => void
    setSortOrder: (order: 'asc' | 'desc') => void
    setFilterTags: (tags: string[]) => void
    setSearchQuery: (query: string) => void
    setDateRange: (range: { start?: Date; end?: Date }) => void
    setTypeFilter: (filter: 'all' | 'generated' | 'corrected' | 'videos') => void
    setPage: (page: number) => void
    deleteItems: (ids: string[]) => Promise<boolean>
    bulkExport: (ids: string[]) => Promise<void>
    refreshGallery: () => Promise<void>
  }
}

// Video Builder Store
export interface VideoBuilderStore {
  // Video creation state
  firstImage: GenerationResult | null
  lastImage: GenerationResult | null
  isBuilding: boolean
  buildProgress?: number
  
  // Settings
  settings: VideoBuilderSettings
  previewUrl?: string
  
  // Output
  generatedVideo?: VideoMetadata
  
  // Actions
  actions: {
    setFirstImage: (image: GenerationResult | null) => void
    setLastImage: (image: GenerationResult | null) => void
    updateSettings: (settings: Partial<VideoBuilderSettings>) => void
    buildVideo: () => Promise<VideoMetadata>
    clearVideo: () => void
    exportToPremiere: (videoId: string) => Promise<boolean>
  }
}

export interface VideoBuilderSettings {
  holdDuration: number // seconds
  transitionDuration: number // seconds
  transitionType: 'dissolve' | 'fade' | 'cut'
  outputFormat: 'mp4' | 'mov' | 'webm'
  quality: 'low' | 'medium' | 'high' | 'ultra'
  frameRate: 24 | 30 | 60
  resolution: { width: number; height: number }
  addMarkers: boolean
}

// Premiere Integration Store
export interface PremiereStore {
  // Connection state
  isConnected: boolean
  connectionError?: string
  
  // Application state
  applicationState: PremiereApplicationState | null
  
  // Import/Export tracking
  importHistory: ImportRecord[]
  exportHistory: ExportRecord[]
  
  // Actions
  actions: {
    connect: () => Promise<boolean>
    disconnect: () => void
    refreshState: () => Promise<void>
    importAsset: (blobUrl: string, options?: StoreImportOptions) => Promise<ProjectItem>
    exportSequence: (sequenceId: string, settings: StoreExportSettings) => Promise<string>
    addMarker: (position: number, name: string, data?: Record<string, unknown>) => Promise<void>
    readMetadata: (itemId: string) => Promise<Record<string, unknown>>
  }
}

export interface ImportRecord {
  id: string
  blobUrl: string
  projectItemId?: string
  timestamp: Date
  success: boolean
  error?: string
}

export interface ExportRecord {
  id: string
  sequenceId: string
  outputPath: string
  blobUrl?: string
  timestamp: Date
  success: boolean
  duration: number
  error?: string
}

export interface StoreImportOptions {
  targetBin?: string
  addToTimeline?: boolean
  timelinePosition?: number
}

export interface StoreExportSettings {
  format: 'h264' | 'h265' | 'prores'
  quality: 'low' | 'medium' | 'high'
  outputPath: string
  uploadToBlob?: boolean
}

// UI Store
export interface UIStore {
  // Loading states
  isLoading: boolean
  loadingMessage: string
  loadingProgress?: number
  
  // Toast notifications
  toasts: Toast[]
  
  // Navigation and layout
  activeTab: 'generate' | 'gallery' | 'video' | 'export' | 'settings'
  panelSize: { width: number; height: number }
  sidebarCollapsed: boolean
  
  // Modals and dialogs
  activeModal: string | null
  modalData: Record<string, unknown>
  
  // Theme and preferences
  theme: 'light' | 'dark' | 'auto'
  preferences: UserPreferences
  
  // Actions
  actions: {
    setLoading: (loading: boolean, message?: string, progress?: number) => void
    addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => void
    removeToast: (id: string) => void
    clearToasts: () => void
    setActiveTab: (tab: 'generate' | 'gallery' | 'video' | 'export' | 'settings') => void
    setPanelSize: (size: { width: number; height: number }) => void
    setSidebarCollapsed: (collapsed: boolean) => void
    showModal: (modalId: string, data?: Record<string, unknown>) => void
    hideModal: () => void
    setTheme: (theme: 'light' | 'dark' | 'auto') => void
    updatePreferences: (preferences: Partial<UserPreferences>) => void
  }
}

export interface Toast {
  id: string
  type: 'positive' | 'negative' | 'info' | 'notice'
  title: string
  message?: string
  timeout?: number
  timestamp: Date
  actionLabel?: string
  actionCallback?: () => void
}

export interface UserPreferences {
  autoSave: boolean
  defaultPrompt: string
  defaultStyle: string
  defaultAspectRatio: string
  maxHistoryItems: number
  enableNotifications: boolean
  enableTelemetry: boolean
  exportQuality: 'low' | 'medium' | 'high'
  videoFormat: 'mp4' | 'mov'
  debugMode: boolean
}

// Configuration Store
export interface ConfigStore {
  // API configurations
  firefly: FireflyConfig | null
  gemini: GeminiConfig | null
  azureBlob: BlobStorageConfig | null
  
  // Environment settings
  environment: 'development' | 'staging' | 'production'
  apiEndpoints: Record<string, string>
  
  // Feature flags
  features: FeatureFlags
  
  // Actions
  actions: {
    updateFireflyConfig: (config: Partial<FireflyConfig>) => void
    updateGeminiConfig: (config: Partial<GeminiConfig>) => void
    updateBlobConfig: (config: Partial<BlobStorageConfig>) => void
    setEnvironment: (env: 'development' | 'staging' | 'production') => void
    toggleFeature: (feature: keyof FeatureFlags, enabled: boolean) => void
    resetConfig: () => void
  }
}

export interface FeatureFlags {
  enableBatchGeneration: boolean
  enableVideoBuilder: boolean
  enableAdvancedCorrection: boolean
  enableMetadataLogging: boolean
  enableAutoExport: boolean
  enableDebugMode: boolean
  enableTelemetry: boolean
}

// Root Store Type (for combining all stores)
export interface RootStore {
  auth: AuthStore
  generation: GenerationStore
  gallery: GalleryStore
  videoBuilder: VideoBuilderStore
  premiere: PremiereStore
  ui: UIStore
  config: ConfigStore
}

// Store creation utilities
export type StoreSlice<T> = (
  set: (partial: T | Partial<T> | ((state: T) => T | Partial<T>)) => void,
  get: () => T
) => T

export type StoreActions<T> = T extends { actions: infer A } ? A : never
export type StoreState<T> = Omit<T, 'actions'>
