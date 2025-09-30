/**
 * Luma Labs Dream Machine Types
 * Based on docs/lumalabsai.yaml (OpenAPI 3.1).
 */

export type LumaGenerationState = 'queued' | 'dreaming' | 'completed' | 'failed'

export type LumaAspectRatio =
  | '1:1'
  | '16:9'
  | '9:16'
  | '4:3'
  | '3:4'
  | '21:9'
  | '9:21'
  | string

export type LumaVideoModel = 'ray-1-6' | 'ray-2' | 'ray-flash-2'

export type LumaVideoResolution =
  | '540p'
  | '720p'
  | '1080p'
  | '1440p'
  | '4k'
  | string

export type LumaVideoDuration = '5s' | '9s' | string

export type ReframeVideoModel = 'ray-2' | 'ray-flash-2'

export interface LumaConcept {
  key: string
}

export interface LumaKeyframe {
  type: 'generation' | 'image'
  url?: string
  id?: string
}

export interface LumaKeyframes {
  frame0?: LumaKeyframe
  frame1?: LumaKeyframe
  frame2?: LumaKeyframe
  frame3?: LumaKeyframe
}

export interface LumaGenerationRequest {
  generation_type?: 'video'
  prompt?: string
  aspect_ratio?: LumaAspectRatio
  loop?: boolean
  keyframes?: LumaKeyframes
  callback_url?: string
  model: LumaVideoModel
  resolution?: LumaVideoResolution
  duration?: LumaVideoDuration
  concepts?: LumaConcept[]
}

export interface LumaReframeVideoRequest {
  generation_type: 'reframe_video'
  media: {
    url: string
  }
  first_frame?: {
    url: string
  }
  model: ReframeVideoModel
  prompt?: string
  aspect_ratio: LumaAspectRatio
  grid_position_x?: number
  grid_position_y?: number
  x_start?: number
  x_end?: number
  y_start?: number
  y_end?: number
  resized_width?: number
  resized_height?: number
  callback_url?: string
}

export interface LumaGenerationAssets {
  video?: string
  image?: string
  progress_video?: string
}

export interface LumaGenerationResponse {
  id: string
  generation_type?: 'video' | 'image' | 'reframe_video'
  state: LumaGenerationState
  failure_reason?: string | null
  created_at?: string
  updated_at?: string
  assets?: LumaGenerationAssets | null
  model?: string
  request?: Record<string, unknown>
}

export interface LumaVideoGenerationMetadata {
  id: string
  state: LumaGenerationState
  prompt?: string
  model?: string
  aspectRatio?: string
  duration?: string
  createdAt?: string
  completedAt?: string
  failureReason?: string | null
  request?: unknown
  pollingAttempts: number
  pollingIntervalMs: number
  totalElapsedMs: number
}

export interface LumaReframeVideoMetadata {
  id: string
  state: LumaGenerationState
  prompt?: string
  model?: string
  aspectRatio?: string
  createdAt?: string
  completedAt?: string
  failureReason?: string | null
  request?: unknown
  pollingAttempts: number
  pollingIntervalMs: number
  totalElapsedMs: number
}

export interface LumaVideoGenerationResult {
  blob: Blob
  contentType: string
  filename: string
  generation: LumaGenerationResponse
  metadata: LumaVideoGenerationMetadata
}

export interface LumaReframeVideoResult {
  blob: Blob
  contentType: string
  filename: string
  generation: LumaGenerationResponse
  metadata: LumaReframeVideoMetadata
}

export interface LumaVideoGenerationOptions {
  signal?: AbortSignal
  filename?: string
}
