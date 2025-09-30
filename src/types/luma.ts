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

export interface LumaConcept {
  key: string
}

export interface LumaImageReference {
  type: 'image'
  url: string
}

export interface LumaGenerationRequest {
  generation_type?: 'video'
  prompt?: string
  aspect_ratio?: LumaAspectRatio
  loop?: boolean
  first_frame?: LumaImageReference
  last_frame?: LumaImageReference
  keyframes?: Record<string, unknown>
  callback_url?: string
  model: LumaVideoModel
  resolution?: LumaVideoResolution
  duration?: LumaVideoDuration
  concepts?: LumaConcept[]
}

export interface LumaGenerationAssets {
  video?: string
  image?: string
  progress_video?: string
}

export interface LumaGenerationResponse {
  id: string
  generation_type?: 'video' | 'image'
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

export interface LumaVideoGenerationResult {
  blob: Blob
  contentType: string
  filename: string
  generation: LumaGenerationResponse
  metadata: LumaVideoGenerationMetadata
}

export interface LumaVideoGenerationOptions {
  signal?: AbortSignal
  filename?: string
}
