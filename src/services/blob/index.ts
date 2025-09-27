// Azure Blob Storage Service - Cloud asset storage
// Enhanced with SAS URL generation and environment-aware connections

export { BlobService, createBlobService } from './BlobService.js'
export type { BlobServiceConfig } from './BlobService.js'

// Azure SDK Blob Storage Service - Production-ready Azure SDK integration
export {
  AzureSDKBlobService,
  createAzureSDKBlobService,
} from './AzureSDKBlobService.js'

// Re-export blob types for convenience
export type {
  ImageMetadata,
  VideoMetadata,
  BlobAccessInfo,
  SasUrlOptions,
  BlobPermissions,
  BlobStorageError,
  EnvironmentAwareBlobConfig,
} from '../../types/blob.js'

// Re-export Azure SDK blob types
export type {
  AzureSDKBlobConfig,
  AzureBlobUploadResponse,
  AzureBlobDownloadResponse,
  AzureBlobInfo,
  AzureBlobError,
  StorageAccountStats,
} from '../../types/azureBlob.js'
