/**
 * FAL.ai Video Generation API Types
 * Based on Wan-2.1 First-Last-Frame-to-Video model
 * Documentation: https://fal.run/fal-ai/wan-flf2v
 */

// ========================= Core Status Types =========================

export type FalJobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled'

export interface FalVideoFile {
  url: string
  filename: string
  blob: Blob
}

// ========================= FAL.ai API Types =========================

export interface FalVideoRequest {
  prompt: string                         // Text prompt to guide video generation
  start_image_url: string               // URL of starting image
  end_image_url: string                 // URL of ending image
  num_frames?: number                   // 81-100 frames (default: 81)
  frames_per_second?: number            // 5-24 FPS (default: 16)
  resolution?: '480p' | '720p'          // Video resolution (default: '720p')
  num_inference_steps?: number          // 2-40 steps (default: 30)
  guide_scale?: number                  // 1-10 guidance (default: 5)
  shift?: number                        // 1-10 shift parameter (default: 5)
  aspect_ratio?: 'auto' | '16:9' | '9:16' | '1:1'  // Aspect ratio
  enable_safety_checker?: boolean       // Content safety filtering
  enable_prompt_expansion?: boolean     // Whether to enable prompt expansion
  acceleration?: 'none' | 'regular'     // Speed vs quality tradeoff
  seed?: number                         // Random seed for reproducibility
  negative_prompt?: string              // Negative prompt for video generation
}

export interface FalVideoResponse {
  video: {
    url: string                         // Generated video file URL
  }
  seed: number                          // Seed used for generation
}

export interface FalVideoFile {
  url: string                          // Video file URL
  file_name?: string                   // Original filename
  file_size?: number                   // File size in bytes
  content_type?: string                // MIME type
}

// ========================= Service Response Types =========================

export interface FalServiceResponse<T> {
  success: boolean
  data?: T
  error?: FalServiceError
  timestamp: Date
  requestId?: string
}

export interface FalServiceError {
  code: string
  message: string
  details?: unknown
  timestamp: Date
  canRetry: boolean
  retryAfter?: number
}

// ========================= Video Generation Types =========================

export interface VideoGenerationRequest {
  prompt: string
  firstImageId: string                 // ID of first frame image from Gallery
  lastImageId: string                  // ID of last frame image from Gallery
  settings: VideoGenerationSettings
}

export interface VideoGenerationSettings {
  resolution: '480p' | '720p'
  frameCount: number                   // 81-100
  frameRate: number                    // 5-24 FPS
  inferenceSteps: number               // 2-40
  guidanceScale: number                // 1-10
  aspectRatio: 'auto' | '16:9' | '9:16' | '1:1'
  enableSafetyChecker: boolean
  acceleration: 'none' | 'regular'
  seed?: number
  negativePrompt?: string
}

export interface VideoGenerationResult {
  video: FalVideoFile
  metadata: FalVideoMetadata
  generatedAt: string
  jobId: string
  status: FalJobStatus
}

export type VideoGenerationStatus = 
  | 'pending'
  | 'processing' 
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface FalVideoMetadata {
  prompt: string
  model: string                        // 'fal-ai/wan-flf2v'
  resolution: string
  duration: number                     // Duration in seconds
  frameCount: number
  frameRate: number
  aspectRatio: string
  fileSize: number
  contentType: string
  seed: number
  processingTime: number
  timestamp: Date
  version: string
  jobId: string
  startImageMetadata: {
    id: string
    filename: string
    prompt?: string
  }
  endImageMetadata: {
    id: string
    filename: string
    prompt?: string
  }
}

// ========================= Generation Progress Types =========================

export interface GenerationProgress {
  percentage: number                   // 0-100
  stage: VideoGenerationStage
  message: string
  estimatedTimeRemaining?: number      // Seconds
  logs?: string[]
}

export type VideoGenerationStage = 
  | 'initializing'
  | 'uploading_images'
  | 'processing_frames'
  | 'generating_video'
  | 'post_processing'
  | 'downloading'
  | 'complete'
  | 'error'

// ========================= Storage Types =========================

export interface StoredVideo {
  id: string
  filename: string
  videoUrl: string                     // Stored video URL (Azure Blob)
  downloadUrl?: string                 // Original FAL.ai URL
  size: number
  contentType: string
  duration: number
  timestamp: number
  storageType: 'azure'
  metadata: FalVideoMetadata
}

// ========================= UI Component Types =========================

export interface VideoGenerationFormData {
  prompt: string
  firstImageId: string | null
  lastImageId: string | null
  settings: VideoGenerationSettings
}

export interface ImageSelectionState {
  selectedFirst: string | null
  selectedLast: string | null
  selectionMode: 'first' | 'last' | null
}

export interface VideoQualityPreset {
  name: string
  description: string
  settings: Partial<VideoGenerationSettings>
}

// ========================= Store Types =========================

export interface VideoBuilderState {
  // Current generation
  currentRequest: VideoGenerationRequest | null
  isGenerating: boolean
  generationProgress: GenerationProgress | null
  
  // Generation history
  videoHistory: VideoGenerationResult[]
  
  // UI state
  formData: VideoGenerationFormData
  imageSelection: ImageSelectionState
  selectedVideo: VideoGenerationResult | null
  
  // Settings
  qualityPresets: VideoQualityPreset[]
  defaultSettings: VideoGenerationSettings
  
  // Actions
  actions: {
    // Generation control
    startGeneration: (request: VideoGenerationRequest) => Promise<void>
    cancelGeneration: () => void
    updateProgress: (progress: GenerationProgress) => void
    
    // Form management
    updateFormData: (data: Partial<VideoGenerationFormData>) => void
    updateSettings: (settings: Partial<VideoGenerationSettings>) => void
    resetForm: () => void
    
    // Image selection
    selectFirstImage: (imageId: string) => void
    selectLastImage: (imageId: string) => void
    clearImageSelection: () => void
    setSelectionMode: (mode: 'first' | 'last' | null) => void
    
    // History management
    addVideoToHistory: (video: VideoGenerationResult) => void
    selectVideo: (videoId: string) => void
    deleteVideo: (videoId: string) => void
    clearVideoHistory: () => void
    
    // Preset management
    applyPreset: (preset: VideoQualityPreset) => void
    saveAsPreset: (name: string, description: string) => void
  }
}

// ========================= Default Values =========================

export const defaultVideoSettings: VideoGenerationSettings = {
  resolution: '720p',
  frameCount: 81,
  frameRate: 16,
  inferenceSteps: 30,
  guidanceScale: 5,
  aspectRatio: 'auto',
  enableSafetyChecker: false,
  acceleration: 'regular'
}

export const videoQualityPresets: VideoQualityPreset[] = [
  {
    name: 'Quick Draft',
    description: 'Fast generation with lower quality',
    settings: {
      resolution: '480p',
      frameCount: 81,
      frameRate: 16,
      inferenceSteps: 20,
      acceleration: 'regular'
    }
  },
  {
    name: 'Balanced',
    description: 'Good quality with reasonable generation time',
    settings: {
      resolution: '720p',
      frameCount: 81,
      frameRate: 16,
      inferenceSteps: 30,
      acceleration: 'regular'
    }
  },
  {
    name: 'High Quality',
    description: 'Best quality, slower generation',
    settings: {
      resolution: '720p',
      frameCount: 100,
      frameRate: 24,
      inferenceSteps: 40,
      acceleration: 'none'
    }
  }
]

// ========================= Validation Types =========================

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface VideoGenerationValidation {
  prompt: ValidationResult
  images: ValidationResult
  settings: ValidationResult
  overall: ValidationResult
}