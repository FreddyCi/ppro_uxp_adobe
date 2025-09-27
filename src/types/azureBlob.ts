/**
 * Azure SDK Blob Storage Types
 * Enhanced types for Azure Storage Blob SDK v12 integration
 * Extends base blob types with Azure-specific functionality
 */

import type {
  ContainerCreateOptions,
  BlobHTTPHeaders,
  BlobSASPermissions,
  PublicAccessType,
  BlobItem,
} from '@azure/storage-blob'

import type {
  ImageMetadata,
  VideoMetadata,
  BlobStorageError,
  EnvironmentAwareBlobConfig,
} from './blob.js'

// Azure SDK Service Configuration
export interface AzureSDKBlobConfig extends EnvironmentAwareBlobConfig {
  // Azure Storage Account credentials
  storageAccountName: string
  storageAccountKey?: string
  connectionString?: string

  // Azure AD Service Principal (for production)
  clientId?: string
  clientSecret?: string
  tenantId?: string

  // Container configuration
  defaultContainer: string
  containers: {
    images: string
    videos: string
    temp: string
    exports: string
  }

  // SAS token configuration
  defaultSasExpirationMinutes: number
  maxSasExpirationMinutes: number
  allowedSasPermissions: BlobSASPermissions[]

  // Performance and limits
  maxFileSize: number
  allowedMimeTypes: string[]
  parallelUploads: number
  chunkSize: number

  // CORS settings for production
  corsSettings?: {
    allowedOrigins: string[]
    allowedMethods: string[]
    allowedHeaders: string[]
    maxAgeInSeconds: number
  }
}

// Azure SDK Response Types
export interface AzureBlobUploadResponse {
  success: boolean
  blobUrl: string
  etag: string
  lastModified: Date
  contentMD5?: string
  requestId: string
  version: string
  date: Date
  errorCode?: string
  errorMessage?: string
}

export interface AzureBlobDownloadResponse {
  success: boolean
  blob: Blob
  metadata: Record<string, string>
  contentType: string
  contentLength: number
  etag: string
  lastModified: Date
  blobType: string
  errorCode?: string
  errorMessage?: string
}

export interface AzureBlobInfo extends BlobItem {
  sasUrl?: string
  accessInfo?: BlobAccessInfo
  customMetadata?: ImageMetadata | VideoMetadata
}

// SAS Token Management
export interface SasTokenRequest {
  containerName: string
  blobName?: string
  permissions: AzureBlobPermissions
  expiresInMinutes: number
  startTime?: Date
  ipRange?: string
  protocol?: 'https' | 'https,http'
  cacheControl?: string
  contentDisposition?: string
  contentEncoding?: string
  contentLanguage?: string
  contentType?: string
}

export interface SasTokenResponse {
  sasUrl: string
  token: string
  expiresAt: Date
  permissions: AzureBlobPermissions
  containerName: string
  blobName?: string
}

export type AzureBlobPermissions =
  | 'read'
  | 'write'
  | 'delete'
  | 'list'
  | 'add'
  | 'create'
  | 'update'
  | 'process'

// Container Management
export interface AzureContainerInfo {
  name: string
  url: string
  exists: boolean
  created?: Date
  lastModified?: Date
  etag?: string
  publicAccess: PublicAccessType
  metadata: Record<string, string>
  hasImmutabilityPolicy?: boolean
  hasLegalHold?: boolean
  leaseDuration?: string
  leaseState?: string
  leaseStatus?: string
}

export interface ContainerCreateRequest {
  name: string
  publicAccess?: PublicAccessType
  metadata?: Record<string, string>
  options?: ContainerCreateOptions
}

export interface ContainerPermissionsConfig {
  publicAccess: PublicAccessType
  sasPermissions: {
    read: boolean
    write: boolean
    delete: boolean
    list: boolean
  }
  allowedOrigins?: string[]
  corsRules?: Array<{
    allowedOrigins: string[]
    allowedMethods: string[]
    allowedHeaders: string[]
    exposedHeaders: string[]
    maxAgeInSeconds: number
  }>
}

// Blob Operations
export interface BlobUploadRequest {
  file: File | Blob | Buffer | Uint8Array
  containerName: string
  blobName: string
  metadata?: Record<string, string>
  tags?: Record<string, string>
  headers?: BlobHTTPHeaders
  tier?: 'Hot' | 'Cool' | 'Archive'
  overwrite?: boolean
  progressCallback?: (progress: UploadProgress) => void
}

export interface BlobDownloadRequest {
  containerName: string
  blobName: string
  range?: {
    offset: number
    count: number
  }
  progressCallback?: (progress: DownloadProgress) => void
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
  estimatedTimeRemaining?: number
  uploadSpeed?: number
}

export interface DownloadProgress {
  loaded: number
  total: number
  percentage: number
  downloadSpeed?: number
}

// Metadata Management
export interface BlobMetadata {
  // Standard metadata
  originalName: string
  mimeType: string
  uploadedAt: string
  userId: string
  sessionId: string

  // Image-specific metadata (optional)
  width: string
  height: string
  aspectRatio: string
  generationId: string
  correctionId: string

  // Video-specific metadata (optional)
  duration: string
  frameRate: string
  bitrate: string
  firstImageId: string
  lastImageId: string

  // Processing metadata
  operations: string // JSON string of operations array
  tags: string // Comma-separated tags

  // Allow additional string metadata
  [key: string]: string
}

export interface BlobProperties {
  contentType: string
  contentLength: number
  contentMD5?: string
  contentEncoding?: string
  contentLanguage?: string
  cacheControl?: string
  contentDisposition?: string
  etag: string
  lastModified: Date
  blobType: string
  accessTier?: string
  archiveStatus?: string
  serverEncrypted: boolean
  rehydratePriority?: string
  createdOn?: Date
  versionId?: string
  isCurrentVersion?: boolean
  tagCount?: number
  expiresOn?: Date
}

// Error Handling
export interface AzureBlobError extends BlobStorageError {
  azureErrorCode?: string
  azureErrorMessage?: string
  requestId?: string
  clientRequestId?: string
  date?: Date
  serviceVersion?: string
  retryable: boolean
  retryAfter?: number
}

export interface RetryOptions {
  maxRetries: number
  initialRetryDelayMs: number
  maxRetryDelayMs: number
  exponentialBase: number
  jitterMs: number
  retryableErrors: string[]
}

// Service Health and Diagnostics
export interface StorageAccountStats {
  geoReplication?: {
    status: string
    lastSyncTime?: Date
  }
}

export interface BlobServiceStats {
  accountKind: string
  skuName: string
  isHierarchicalNamespaceEnabled: boolean
  blobContainers: {
    total: number
    withData: number
  }
  totalBlobs: number
  totalSize: number
  lastUpdated: Date
}

export interface ConnectionTestResult {
  success: boolean
  endpoint: string
  accountName: string
  timestamp: Date
  responseTime: number
  features: {
    blobService: boolean
    containerAccess: boolean
    sasGeneration: boolean
    metadataSupport: boolean
  }
  error?: AzureBlobError
}

// Batch Operations
export interface BatchOperationRequest {
  operations: Array<{
    type: 'upload' | 'download' | 'delete' | 'setMetadata' | 'setTier'
    containerName: string
    blobName: string
    data?: File | Blob | Buffer | Uint8Array
    metadata?: Record<string, string>
    tier?: 'Hot' | 'Cool' | 'Archive'
  }>
  concurrency?: number
  progressCallback?: (progress: BatchProgress) => void
}

export interface BatchProgress {
  completed: number
  total: number
  failed: number
  currentOperation?: string
  percentage: number
  errors: Array<{
    operation: BatchOperationRequest['operations'][0]
    error: AzureBlobError
  }>
}

export interface BatchOperationResult {
  success: boolean
  totalOperations: number
  successfulOperations: number
  failedOperations: number
  results: Array<{
    operation: BatchOperationRequest['operations'][0]
    success: boolean
    result?: AzureBlobUploadResponse | AzureBlobDownloadResponse | boolean
    error?: AzureBlobError
  }>
  duration: number
}

// Access Control and Security
export interface BlobAccessInfo {
  url: string
  sasUrl?: string
  expiresAt?: Date
  permissions: AzureBlobPermissions[]
  containerName: string
  blobName: string
  accessLevel: 'public' | 'private' | 'sas'
  securityFeatures: {
    encryption: boolean
    httpsOnly: boolean
    immutable: boolean
    versioning: boolean
  }
}

export interface SecurityConfig {
  httpsOnly: boolean
  allowBlobPublicAccess: boolean
  minimumTlsVersion: '1.0' | '1.1' | '1.2'
  allowSharedKeyAccess: boolean
  allowedCorsOrigins: string[]
  blobEncryption: {
    enabled: boolean
    keySource: 'Microsoft.Storage' | 'Microsoft.Keyvault'
    keyVaultProperties?: {
      keyName: string
      keyVersion?: string
      keyVaultUri: string
    }
  }
}

// Lifecycle Management
export interface LifecyclePolicyRule {
  name: string
  enabled: boolean
  type: 'Lifecycle'
  definition: {
    filters?: {
      blobTypes: string[]
      prefixMatch?: string[]
      blobIndexMatch?: Array<{
        name: string
        op: string
        value: string
      }>
    }
    actions: {
      baseBlob?: {
        tierToCool?: { daysAfterModificationGreaterThan: number }
        tierToArchive?: { daysAfterModificationGreaterThan: number }
        delete?: { daysAfterModificationGreaterThan: number }
      }
      snapshot?: {
        tierToCool?: { daysAfterCreationGreaterThan: number }
        tierToArchive?: { daysAfterCreationGreaterThan: number }
        delete?: { daysAfterCreationGreaterThan: number }
      }
      version?: {
        tierToCool?: { daysAfterCreationGreaterThan: number }
        tierToArchive?: { daysAfterCreationGreaterThan: number }
        delete?: { daysAfterCreationGreaterThan: number }
      }
    }
  }
}

// Events and Monitoring
export interface BlobEvent {
  eventType:
    | 'Microsoft.Storage.BlobCreated'
    | 'Microsoft.Storage.BlobDeleted'
    | 'Microsoft.Storage.BlobTierChanged'
  eventTime: Date
  id: string
  subject: string
  dataVersion: string
  metadataVersion: string
  data: {
    api: string
    clientRequestId: string
    requestId: string
    eTag: string
    contentType: string
    contentLength: number
    blobType: string
    accessTier?: string
    url: string
    sequencer: string
    storageDiagnostics: {
      batchId: string
    }
  }
}

export interface MonitoringMetrics {
  requestCount: number
  successRate: number
  averageResponseTime: number
  errorRate: number
  bandwidthUsage: {
    ingress: number
    egress: number
  }
  storageUsage: {
    totalSize: number
    blobCount: number
    containerCount: number
  }
  timeRange: {
    start: Date
    end: Date
  }
}

// Export commonly used Azure SDK types for convenience
export type {
  ContainerCreateOptions,
  BlobHTTPHeaders,
  BlobSASPermissions,
  PublicAccessType,
  BlobServiceProperties,
  BlobItem,
} from '@azure/storage-blob'
