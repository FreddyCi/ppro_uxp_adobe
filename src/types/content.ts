// Unified Content Model
// Consolidates all content types (images, videos, corrections) into a single interface

import type { BaseMetadata } from './blob'
import type { GenerationMetadata } from './firefly'
import type { CorrectionMetadata, CorrectionParams } from './gemini'

// Content type discriminator
export type ContentType = 'generated-image' | 'corrected-image' | 'video' | 'uploaded-image' | 'uploaded-video'

// Unified content item interface
export interface ContentItem extends BaseMetadata {
  // Type discrimination
  contentType: ContentType

  // Common display properties
  displayUrl: string // Primary URL for display (blob URL, data URL, or local path)
  thumbnailUrl?: string // Thumbnail for gallery view
  blobUrl?: string // Azure Blob storage URL
  localPath?: string // Local filesystem path
  localMetadataPath?: string // Path to metadata JSON file

  // Content-specific properties
  content: ContentItemData

  // Storage and persistence
  storageMode: 'azure' | 'local' | 'memory'
  persistenceMethod: 'blob' | 'dataUrl' | 'presigned' | 'local'
  folderToken?: string // UXP token for folder access
  relativePath?: string // Relative path within UXP storage

  // Status and lifecycle
  status: 'processing' | 'ready' | 'error' | 'expired'
  errorMessage?: string

  // Relationships
  parentId?: string // ID of parent content (e.g., original for corrections)
  sessionId?: string // Generation session ID
}

// Content-specific data discriminated by type
export type ContentItemData =
  | GeneratedImageData
  | CorrectedImageData
  | VideoData
  | UploadedImageData
  | UploadedVideoData

// Generated image content
export interface GeneratedImageData {
  type: 'generated-image'
  imageUrl: string
  downloadUrl?: string
  seed: number
  generationMetadata: GenerationMetadata
  prompt: string
  style?: Record<string, unknown>
  size: { width: number; height: number }
}

// Corrected image content
export interface CorrectedImageData {
  type: 'corrected-image'
  originalUrl: string
  correctedUrl: string
  corrections: CorrectionParams
  correctionMetadata: CorrectionMetadata
  parentGenerationId?: string
  azureMetadata?: {
    containerName: string
    blobName: string
    blobUrl: string
    uploadedAt: string
    etag?: string
    size?: number
  }
}

// Video content
export interface VideoData {
  type: 'video'
  videoUrl: string
  videoBlob?: Blob
  duration: number
  fps?: number
  resolution: { width: number; height: number }
  codec?: string
  hasAudio?: boolean
  audioCodec?: string
  thumbnailTime?: number
  renderSettings?: {
    format: 'mp4' | 'mov' | 'webm'
    quality: 'low' | 'medium' | 'high' | 'ultra'
    preset: 'web' | 'archive' | 'review' | 'broadcast'
  }
  // Video generation tracking
  firstImageId?: string
  lastImageId?: string
  transitionType?: 'dissolve' | 'fade' | 'cut'
  holdDuration?: number
  transitionDuration?: number
}

// Uploaded image content
export interface UploadedImageData {
  type: 'uploaded-image'
  imageUrl: string
  originalFile: File
  dimensions?: { width: number; height: number }
  colorSpace?: 'sRGB' | 'Adobe RGB' | 'ProPhoto RGB'
  hasAlpha?: boolean
}

// Uploaded video content
export interface UploadedVideoData {
  type: 'uploaded-video'
  videoUrl: string
  originalFile: File
  duration: number
  dimensions: { width: number; height: number }
  fps?: number
  codec?: string
  hasAudio?: boolean
  audioCodec?: string
}

// Type guards for content discrimination
export const isGeneratedImage = (item: ContentItem): item is ContentItem & { content: GeneratedImageData } =>
  item.content.type === 'generated-image'

export const isCorrectedImage = (item: ContentItem): item is ContentItem & { content: CorrectedImageData } =>
  item.content.type === 'corrected-image'

export const isVideo = (item: ContentItem): item is ContentItem & { content: VideoData } =>
  item.content.type === 'video'

export const isUploadedImage = (item: ContentItem): item is ContentItem & { content: UploadedImageData } =>
  item.content.type === 'uploaded-image'

export const isUploadedVideo = (item: ContentItem): item is ContentItem & { content: UploadedVideoData } =>
  item.content.type === 'uploaded-video'

export const isImageContent = (item: ContentItem): boolean =>
  ['generated-image', 'corrected-image', 'uploaded-image'].includes(item.contentType)

export const isVideoContent = (item: ContentItem): boolean =>
  ['video', 'uploaded-video'].includes(item.contentType)

// Migration helpers for converting existing types to unified model
export const convertGenerationResultToContentItem = (result: import('./firefly').GenerationResult): ContentItem => {
  // Detect if this is a video based on contentType field or videoUrl/videoBlob presence
  const isVideoResult = result.contentType === 'video' || 
                       !!(result as any).videoUrl || 
                       !!(result as any).videoBlob ||
                       result.metadata.contentType?.includes('video')

  if (isVideoResult) {
    // Convert as video content
    const videoResult = result as any
    return {
      // Base metadata
      id: result.id,
      filename: result.metadata.filename || `generation_${result.id}.mp4`,
      originalName: result.metadata.filename || `generation_${result.id}.mp4`,
      mimeType: result.metadata.contentType || 'video/mp4',
      size: result.metadata.fileSize || 0,
      tags: [],
      timestamp: new Date(result.timestamp),
      userId: result.metadata.userId,
      sessionId: result.metadata.sessionId,

      // Type and display
      contentType: 'video',
      displayUrl: result.blobUrl || videoResult.videoUrl || result.imageUrl,
      thumbnailUrl: result.thumbnailUrl,
      blobUrl: result.blobUrl,
      localPath: result.localPath,

      // Content data
      content: {
        type: 'video',
        videoUrl: videoResult.videoUrl || result.imageUrl,
        videoBlob: videoResult.videoBlob,
        duration: videoResult.duration || result.metadata.duration || 0,
        fps: videoResult.fps || result.metadata.fps,
        resolution: result.metadata.resolution || videoResult.resolution || { width: 1920, height: 1080 }
      },

      // Storage
      storageMode: result.metadata.storageMode || 'memory',
      persistenceMethod: result.metadata.persistenceMethod || 'blob',
      folderToken: result.metadata.folderToken || undefined,
      relativePath: result.metadata.relativePath,

      // Status
      status: result.status === 'generated' ? 'ready' : 'processing'
    }
  }

  // Convert as image content (default behavior)
  return {
    // Base metadata
    id: result.id,
    filename: result.metadata.filename || `generation_${result.id}.jpg`,
    originalName: result.metadata.filename || `generation_${result.id}.jpg`,
    mimeType: result.metadata.contentType || 'image/jpeg',
    size: result.metadata.fileSize || 0,
    tags: [],
    timestamp: new Date(result.timestamp),
    userId: result.metadata.userId,
    sessionId: result.metadata.sessionId,

    // Type and display
    contentType: 'generated-image',
    displayUrl: result.blobUrl || result.imageUrl,
    thumbnailUrl: result.thumbnailUrl,
    blobUrl: result.blobUrl,
    localPath: result.localPath,

    // Content data
    content: {
      type: 'generated-image',
      imageUrl: result.imageUrl,
      downloadUrl: result.downloadUrl,
      seed: result.seed,
      generationMetadata: result.metadata,
      prompt: result.metadata.prompt,
      style: result.metadata.style as Record<string, unknown> | undefined,
      size: result.metadata.resolution || { width: 1024, height: 1024 }
    },

    // Storage
    storageMode: result.metadata.storageMode || 'memory',
    persistenceMethod: result.metadata.persistenceMethod || 'blob',
    folderToken: result.metadata.folderToken || undefined,
    relativePath: result.metadata.relativePath,

    // Status
    status: result.status === 'generated' ? 'ready' : 'processing'
  }
}

export const convertCorrectedImageToContentItem = (corrected: import('./gemini').CorrectedImage): ContentItem => ({
  // Base metadata
  id: corrected.id,
  filename: corrected.filename || `correction_${corrected.id}.jpg`,
  originalName: corrected.filename || `correction_${corrected.id}.jpg`,
  mimeType: 'image/jpeg', // Assume JPEG for corrections
  size: corrected.azureMetadata?.size || 0,
  tags: [],
  timestamp: corrected.timestamp,
  userId: undefined,
  sessionId: undefined,

  // Type and display
  contentType: 'corrected-image',
  displayUrl: corrected.blobUrl || corrected.correctedUrl,
  thumbnailUrl: corrected.thumbnailUrl,
  blobUrl: corrected.blobUrl,
  localPath: corrected.localFilePath,
  localMetadataPath: corrected.localMetadataPath,

  // Content data
  content: {
    type: 'corrected-image',
    originalUrl: corrected.originalUrl,
    correctedUrl: corrected.correctedUrl,
    corrections: corrected.corrections,
    correctionMetadata: corrected.metadata,
    parentGenerationId: corrected.parentGenerationId,
    azureMetadata: corrected.azureMetadata
  },

  // Storage
  storageMode: corrected.storageMode || 'memory',
  persistenceMethod: corrected.persistenceMethod || 'blob',
  folderToken: corrected.folderToken,
  relativePath: corrected.relativePath,

  // Status
  status: 'ready'
})

export const convertVideoMetadataToContentItem = (video: import('./blob').VideoMetadata): ContentItem => ({
  // Base metadata (VideoMetadata extends BaseMetadata)
  ...video,

  // Type and display
  contentType: 'video',
  displayUrl: '', // Will be set when blob URL is available
  thumbnailUrl: undefined, // Will be generated

  // Content data
  content: {
    type: 'video',
    videoUrl: '', // Will be set when blob URL is available
    duration: video.duration || 0,
    fps: video.frameRate,
    resolution: { width: video.width || 1920, height: video.height || 1080 },
    codec: video.codec,
    hasAudio: video.hasAudio,
    audioCodec: video.audioCodec,
    thumbnailTime: video.thumbnailTime,
    renderSettings: video.renderSettings,
    firstImageId: video.firstImageId,
    lastImageId: video.lastImageId,
    transitionType: video.transitionType,
    holdDuration: video.holdDuration,
    transitionDuration: video.transitionDuration
  },

  // Storage
  storageMode: 'local', // Videos are typically stored locally
  persistenceMethod: 'local',

  // Status
  status: 'ready'
})