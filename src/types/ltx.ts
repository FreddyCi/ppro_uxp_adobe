/**
 * LTX Video API Types
 * Documentation: https://api.ltx.video/
 */

export interface LtxTextToVideoRequest {
  prompt: string
  duration_seconds?: number
  fps?: number
  width?: number
  height?: number
  seed?: number
  negative_prompt?: string
  guidance_scale?: number
  motion_strength?: number
  output_format?: 'mp4' | 'mov'
  aspect_ratio?: string
}

export interface LtxVideoGenerationOptions {
  /** Optional filename hint for the generated video */
  filename?: string
  /** Abort controller signal to cancel the request */
  signal?: AbortSignal
}

export interface LtxVideoGenerationMetadata {
  requestId: string
  prompt: string
  durationSeconds?: number
  fps?: number
  resolution?: {
    width?: number
    height?: number
  }
  seed?: number
  receivedAt: Date
}

export interface LtxVideoGenerationResult {
  blob: Blob
  contentType: string
  filename: string
  metadata: LtxVideoGenerationMetadata
}

export interface LtxApiErrorPayload {
  error?: string
  message?: string
  code?: string | number
  details?: unknown
}
