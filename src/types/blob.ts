// Azure Blob Storage Types
// For cloud asset storage and management

// Base Metadata Interface
export interface BaseMetadata {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  tags: string[]
  timestamp: Date
  userId?: string
  sessionId?: string
}

// Image-specific Metadata
export interface ImageMetadata extends BaseMetadata {
  width?: number
  height?: number
  aspectRatio?: number
  colorSpace?: 'sRGB' | 'Adobe RGB' | 'ProPhoto RGB'
  hasAlpha?: boolean
  
  // Generation tracking
  generationId?: string
  correctionId?: string
  parentImageId?: string
  
  // Image analysis
  dominantColors?: string[]
  brightness?: number
  contrast?: number
  
  // Processing history
  operations: ImageOperation[]
}

export interface ImageOperation {
  type: 'generation' | 'correction' | 'resize' | 'crop' | 'enhance'
  timestamp: Date
  parameters: Record<string, unknown>
  processingTime?: number
}

// Video-specific Metadata
export interface VideoMetadata extends BaseMetadata {
  duration?: number
  width?: number
  height?: number
  frameRate?: number
  bitrate?: number
  codec?: string
  
  // Video generation tracking
  firstImageId?: string
  lastImageId?: string
  transitionType?: 'dissolve' | 'fade' | 'cut'
  holdDuration?: number
  transitionDuration?: number
  
  // Video analysis
  hasAudio?: boolean
  audioCodec?: string
  thumbnailTime?: number
  
  // Processing history
  renderSettings?: VideoRenderSettings
}

export interface VideoRenderSettings {
  format: 'mp4' | 'mov' | 'webm'
  quality: 'low' | 'medium' | 'high' | 'ultra'
  preset: 'web' | 'archive' | 'review' | 'broadcast'
  customSettings?: {
    videoBitrate?: number
    audioBitrate?: number
    fps?: number
    keyframeInterval?: number
  }
}

// Blob Upload and Download Types
export interface BlobUploadRequest {
  file: File | Blob
  filename: string
  metadata: ImageMetadata | VideoMetadata
  containerName: string
  overwrite?: boolean
  progressCallback?: (progress: UploadProgress) => void
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
  speed?: number // bytes per second
  remainingTime?: number // seconds
}

export interface BlobUploadResult {
  url: string
  filename: string
  size: number
  etag: string
  timestamp: Date
  containerName: string
  blobType: 'BlockBlob' | 'PageBlob' | 'AppendBlob'
  contentMD5?: string
}

// Download and Access Types
export interface BlobDownloadOptions {
  maxAge?: number
  responseType?: 'blob' | 'arrayBuffer' | 'stream'
  range?: {
    start: number
    end: number
  }
  progressCallback?: (progress: DownloadProgress) => void
}

export interface DownloadProgress {
  loaded: number
  total: number
  percentage: number
  speed?: number
}

export interface BlobAccessInfo {
  url: string
  sasUrl?: string
  expiresAt?: Date
  permissions: BlobPermissions
  containerName: string
  blobName: string
}

// SAS URL Configuration
export interface SasUrlOptions {
  permissions: BlobPermissions
  expiresInMinutes: number
  allowedIPs?: string[]
  contentType?: string
}

export type BlobPermissions = 'r' | 'w' | 'd' | 'l' | 'rw' | 'rwdl' | 'full'

// Container Management
export interface BlobContainer {
  name: string
  url: string
  created: Date
  lastModified: Date
  etag: string
  publicAccess: 'none' | 'blob' | 'container'
  metadata: Record<string, string>
}

export interface ContainerListOptions {
  prefix?: string
  maxResults?: number
  includeMetadata?: boolean
  includeDeleted?: boolean
}

// Blob Listing and Search
export interface BlobListOptions {
  prefix?: string
  maxResults?: number
  includeMetadata?: boolean
  includeSnapshots?: boolean
  includeTags?: boolean
  filter?: {
    mimeType?: string[]
    tags?: string[]
    sizeRange?: { min?: number; max?: number }
    dateRange?: { start?: Date; end?: Date }
  }
}

export interface BlobListResult {
  blobs: BlobInfo[]
  continuationToken?: string
  totalCount?: number
}

export interface BlobInfo {
  name: string
  url: string
  size: number
  lastModified: Date
  etag: string
  contentType: string
  contentMD5?: string
  metadata: ImageMetadata | VideoMetadata
  tags: Record<string, string>
  isSnapshot?: boolean
  snapshotTime?: Date
}

// Blob Operations and Management
export interface BlobCopyOperation {
  sourceUrl: string
  destinationContainer: string
  destinationBlob: string
  metadata?: Record<string, string>
  tags?: Record<string, string>
}

export interface BlobDeleteOptions {
  deleteSnapshots?: 'include' | 'only'
  conditions?: {
    ifMatch?: string
    ifNoneMatch?: string
    ifModifiedSince?: Date
    ifUnmodifiedSince?: Date
  }
}

// Error Types
export interface BlobStorageError {
  code: string
  message: string
  statusCode: number
  requestId?: string
  timestamp: Date
  details?: Record<string, unknown>
}

// Configuration
export interface BlobStorageConfig {
  accountName: string
  containerName: string
  connectionString?: string
  sasToken?: string
  endpoint?: string
  timeout?: number
  retryOptions?: {
    maxRetries: number
    retryDelayMs: number
    maxRetryDelayMs: number
  }
}

// Environment-aware configuration
export interface EnvironmentAwareBlobConfig extends BlobStorageConfig {
  environment: 'development' | 'staging' | 'production'
}

// Batch Operations
export interface BlobBatchOperation {
  operation: 'upload' | 'download' | 'delete' | 'copy'
  items: Array<{
    id: string
    source?: string
    destination?: string
    metadata?: Record<string, unknown>
  }>
  concurrency?: number
  progressCallback?: (progress: BatchProgress) => void
}

export interface BatchProgress {
  completed: number
  total: number
  failed: number
  currentItem?: string
  overallProgress: number
}
