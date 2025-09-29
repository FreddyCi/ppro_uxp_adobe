// Adobe Firefly API Types - V3 Async API
// Based on T018 requirements and Firefly API v3 documentation

// Content Class V3
export type ContentClassV3 = 'photo' | 'art'

// Size specification for generated images
export interface SizeV3 {
  width: number
  height: number
}

// Style reference for image generation
export interface StylesV3 {
  presets?: string[]
  referenceImage?: {
    source: {
      uploadId: string
    }
  }
  strength?: number
}

// Structure reference for composition
export interface StructureReferenceV3 {
  imageReference?: {
    source: {
      uploadId: string
    }
  }
}

// V3 Generate Images Request
export interface GenerateImagesRequestV3 {
  prompt: string
  contentClass?: ContentClassV3
  size?: SizeV3
  style?: StylesV3
  structure?: StructureReferenceV3
  numVariations?: number
  seeds?: number[]
  customModelId?: string
}

// V3 Async Response (initial job creation)
export interface AsyncAcceptResponseV3 {
  jobId: string
  statusUrl: string
  cancelUrl: string
}

// Job status response
export interface AsyncTaskResponseV3 {
  jobId: string
  status: 'pending' | 'running' | 'succeeded' | 'failed' | 'canceled'
  progress?: number
  result?: {
    outputs?: OutputImageV3[]
    size?: SizeV3
  }
  // Legacy direct outputs field for compatibility
  outputs?: OutputImageV3[]
  createdAt?: string
  updatedAt?: string
  completedAt?: string
  error?: AsyncApiErrorV3
}

// Output image structure
export interface OutputImageV3 {
  seed: number
  image: PublicBinaryOutputV3
}

// Binary output with download URL
export interface PublicBinaryOutputV3 {
  url: string
  presignedUrl?: string
  filename?: string
  contentType?: string
  size?: number
}

// V3 API Error structure
export interface AsyncApiErrorV3 {
  code: string
  message: string
  details?: Record<string, unknown>
}

// Error codes from API documentation
export type ColligoErrorCodeAsyncV3 = 
  | 'invalid_input_image'
  | 'invalid_size'
  | 'invalid_seed'
  | 'missing_prompt'
  | 'prompt_unsafe'
  | 'server_error'
  | 'job_not_found'
  | 'bad_request'

// Enhanced interfaces for our application
export interface FireflyGenerationRequest {
  prompt: string
  contentClass?: ContentClassV3
  size?: SizeV3
  style?: StylesV3
  structure?: StructureReferenceV3
  numVariations?: number
  seeds?: number[]
  customModelId?: string
  
  // Application-specific options
  priority?: 'low' | 'normal' | 'high'
  userId?: string
  sessionId?: string
}

export interface FireflyGenerationJob {
  jobId: string
  status: 'pending' | 'running' | 'succeeded' | 'failed' | 'cancelled'
  request: FireflyGenerationRequest
  outputs?: GenerationResult[]
  error?: AsyncApiErrorV3
  
  // Timing information
  createdAt: Date
  updatedAt?: Date
  completedAt?: Date
  
  // Retry and polling information
  retryCount?: number
  nextPollTime?: Date
}

export interface GenerationResult {
  id: string
  imageUrl: string
  downloadUrl?: string
  seed: number
  metadata: GenerationMetadata
  timestamp: number
  
  // Application state
  status: 'generated' | 'downloaded' | 'stored' | 'corrected' | 'archived'
  blobUrl?: string // Azure Blob storage URL
  thumbnailUrl?: string
  localPath?: string
}

export interface GenerationMetadata {
  // Original request parameters
  prompt: string
  contentClass?: ContentClassV3
  style?: StylesV3
  size?: SizeV3
  seed: number
  
  // API response metadata
  jobId: string
  model: string
  version: string
  processingTime?: number
  
  // File information
  filename?: string
  contentType?: string
  fileSize?: number
  resolution?: SizeV3
  
  // User tracking
  userId?: string
  sessionId?: string
  timestamp: number
  
  // UXP persistence method
  persistenceMethod?: 'blob' | 'dataUrl' | 'presigned'
}

// Service configuration
export interface FireflyServiceConfig {
  apiUrl: string
  clientId: string
  version: 'v3'
  timeout: number
  maxRetries: number
  retryDelay: number
  maxRetryDelay: number
  pollInterval: number
  maxPollTime: number
}

// Service errors
export interface FireflyServiceError extends Error {
  code: string
  statusCode?: number
  requestId?: string
  retryable: boolean
  originalError?: Error
}

// Rate limiting information
export interface RateLimitInfo {
  remaining: number
  reset: Date
  limit: number
  retryAfter?: number
}

// Service response wrapper
export interface FireflyServiceResponse<T> {
  data: T
  rateLimitInfo?: RateLimitInfo
  requestId?: string
  processingTime: number
}

// Predefined sizes for common use cases
export const FIREFLY_PRESET_SIZES: Record<string, SizeV3> = {
  SQUARE_1024: { width: 1024, height: 1024 },
  SQUARE_512: { width: 512, height: 512 },
  LANDSCAPE_16_9: { width: 1792, height: 1024 },
  LANDSCAPE_4_3: { width: 1344, height: 1024 },
  PORTRAIT_9_16: { width: 1024, height: 1792 },
  PORTRAIT_3_4: { width: 1024, height: 1344 },
  WIDE_21_9: { width: 2048, height: 872 },
  INSTAGRAM_SQUARE: { width: 1080, height: 1080 },
  INSTAGRAM_PORTRAIT: { width: 1080, height: 1350 },
  INSTAGRAM_LANDSCAPE: { width: 1080, height: 566 }
} as const

// Predefined style presets
export const FIREFLY_STYLE_PRESETS = {
  PHOTO: {
    NATURAL: { presets: ['Natural'] },
    PORTRAIT: { presets: ['Portrait'] },
    CINEMATIC: { presets: ['Cinematic'] },
    MACRO: { presets: ['Macro Photography'] }
  },
  ART: {
    DIGITAL: { presets: ['Digital Art'] },
    ILLUSTRATION: { presets: ['Illustration'] },
    CONCEPT_ART: { presets: ['Concept Art'] },
    PAINTING: { presets: ['Oil Painting'] },
    WATERCOLOR: { presets: ['Watercolor'] },
    SKETCH: { presets: ['Pencil Sketch'] }
  }
} as const

// Legacy types for backward compatibility
export type FireflyRequest = FireflyGenerationRequest
export interface FireflyResponse {
  jobId: string
  status: string
  outputs?: GenerationResult[]
  error?: AsyncApiErrorV3
}
export type FireflyOutput = GenerationResult
export type FireflyError = AsyncApiErrorV3
export type GenerationStatus = FireflyGenerationJob

// Export types that were used in existing code
export type FireflyStyle = StylesV3
export type FireflySize = SizeV3
export type FireflyAspectRatio = '1:1' | '4:3' | '3:4' | '16:9' | '9:16' | '3:2' | '2:3'

// Configuration and constants
export type FireflyConfig = FireflyServiceConfig
export const FIREFLY_STYLES = FIREFLY_STYLE_PRESETS
export const FIREFLY_SIZES = FIREFLY_PRESET_SIZES

export interface FireflyGenerationRequest {
  prompt: string
  contentClass?: ContentClassV3
  size?: SizeV3
  style?: StylesV3
  numVariations?: number
  seeds?: number[]
  customModelId?: string // Add this field
}

