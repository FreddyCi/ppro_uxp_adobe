// Google Gemini API Types
// For image correction and enhancement services

// Gemini Correction Request Types
export interface GeminiCorrectionRequest {
  imageUrl?: string
  imageBlob?: Blob
  corrections: CorrectionParams
  outputFormat?: 'jpeg' | 'png' | 'webp'
  quality?: number
  maxResolution?: {
    width: number
    height: number
  }
}

export interface CorrectionParams {
  // Image enhancement operations
  lineCleanup?: boolean
  colorCorrection?: boolean
  perspectiveAdjustment?: boolean
  artifactRemoval?: boolean
  enhanceDetails?: boolean
  noiseReduction?: boolean
  sharpenEdges?: boolean
  
  // Advanced correction parameters
  exposureCorrection?: number // -2.0 to 2.0
  contrastAdjustment?: number // -1.0 to 1.0
  saturationBoost?: number // 0.0 to 2.0
  warmthAdjustment?: number // -1.0 to 1.0
  
  // Custom prompt for simple correction
  customPrompt?: string
}

// Gemini Response Types
export interface GeminiCorrectionResponse {
  id: string
  status: 'processing' | 'completed' | 'failed'
  originalImage?: {
    url: string
    size: ImageDimensions
  }
  correctedImage?: {
    url: string
    size: ImageDimensions
  }
  corrections: CorrectionParams
  metadata: CorrectionMetadata
  error?: GeminiError
}

export interface ImageDimensions {
  width: number
  height: number
  aspectRatio: number
}

export interface GeminiError {
  code: string
  message: string
  type: 'validation' | 'processing' | 'api' | 'network'
  retryable: boolean
}

// Correction Status and Progress
export interface CorrectionStatus {
  id: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress?: number
  estimatedTimeRemaining?: number
  error?: GeminiError
  startTime?: Date
  endTime?: Date
}

// Enhanced Correction Metadata
export interface CorrectionMetadata {
  // Request details
  corrections: CorrectionParams
  originalSize: ImageDimensions
  correctedSize: ImageDimensions
  
  // Processing information
  model: string
  version: string
  processingTime: number
  timestamp: Date
  
  // Quality metrics
  improvementScore?: number // 0-100
  confidenceLevel?: number // 0-1
  
  // Technical details
  operationsApplied: string[]
  resourceUsage: {
    computeTime: number
    memoryUsed: number
  }
}

// Final Result for Gallery
export interface CorrectedImage {
  id: string
  originalUrl: string
  correctedUrl: string
  thumbnailUrl?: string
  corrections: CorrectionParams
  metadata: CorrectionMetadata
  timestamp: Date
  blobUrl?: string // Azure Blob storage URL
  parentGenerationId?: string // Link to original Firefly generation
}

// Before/After Comparison for UI
export interface BeforeAfterComparison {
  id: string
  beforeUrl: string
  afterUrl: string
  beforeSize: ImageDimensions
  afterSize: ImageDimensions
  corrections: CorrectionParams
  metadata: CorrectionMetadata
  accepted: boolean
  zoomLevel?: number
  panPosition?: { x: number; y: number }
}

// Gemini API Configuration
export interface GeminiConfig {
  apiUrl: string
  apiKey: string
  model: string
  timeout?: number
  maxRetries?: number
  defaultQuality?: number
}

// Batch correction for multiple images
export interface GeminiBatchRequest {
  images: Array<{
    id: string
    url: string
    corrections: CorrectionParams
  }>
  priority?: 'low' | 'normal' | 'high'
  webhookUrl?: string
}

export interface GeminiBatchResponse {
  batchId: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  results: GeminiCorrectionResponse[]
  progress: {
    completed: number
    total: number
    failed: number
  }
  estimatedCompletion?: Date
}

// Predefined correction presets
export const GEMINI_PRESETS = {
  BASIC_CLEANUP: {
    lineCleanup: true,
    artifactRemoval: true,
    noiseReduction: true,
  },
  PHOTO_ENHANCEMENT: {
    colorCorrection: true,
    enhanceDetails: true,
    contrastAdjustment: 0.2,
    saturationBoost: 1.1,
  },
  ARTISTIC_REFINEMENT: {
    lineCleanup: true,
    enhanceDetails: true,
    sharpenEdges: true,
    exposureCorrection: 0.1,
  },
  PERSPECTIVE_FIX: {
    perspectiveAdjustment: true,
    lineCleanup: true,
    enhanceDetails: true,
  },
} as const

// Quality assessment
export interface CorrectionQualityAssessment {
  overall: number // 0-100
  categories: {
    clarity: number
    colorBalance: number
    contrast: number
    noise: number
    artifacts: number
  }
  recommendations: string[]
}
