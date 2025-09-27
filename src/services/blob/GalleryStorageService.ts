/**
 * Gallery Storage Service
 * Environment-aware storage service that switches between local memory storage and Azure Storage
 * Based on T023.6 requirements for Gallery-Azure Storage integration
 */

import { createAzureSDKBlobService } from './AzureSDKBlobService.js'
import type { AzureBlobUploadResponse } from '../../types/azureBlob.js'

// Define types locally to avoid circular imports
export interface AzureBlobMetadata {
  containerName: string
  blobName: string
  sasUrl: string
  expiresAt: Date
  blobUrl: string
  etag?: string
  lastModified?: Date
}

export interface StoredImageResult {
  id: string
  blobUrl: string
  dataUrl?: string
  azureMetadata?: AzureBlobMetadata
  isLocal: boolean
  filename: string
  contentType: string
  size: number
  timestamp: string
}

export interface GalleryStorageConfig {
  useAzureStorage: boolean
  azureContainer: string
  storageAccountName: string
  sasExpirationMinutes: number
}

export class GalleryStorageService {
  private config: GalleryStorageConfig
  private azureService: ReturnType<typeof createAzureSDKBlobService> | null =
    null
  private localImageCache = new Map<string, StoredImageResult>()

  constructor(config?: Partial<GalleryStorageConfig>) {
    this.config = {
      useAzureStorage: this.shouldUseAzureStorage(),
      azureContainer: 'uxp-images',
      storageAccountName:
        import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME || 'uxppanelstorage',
      sasExpirationMinutes: 60,
      ...config,
    }

    // Initialize Azure service if needed
    if (this.config.useAzureStorage) {
      try {
        this.azureService = createAzureSDKBlobService()
        console.warn(
          'Gallery Storage: Initialized with Azure Storage only (no localStorage fallback)'
        )
      } catch (error) {
        console.error(
          'Gallery Storage: Failed to initialize Azure Storage:',
          error
        )
        throw new Error(
          `Azure Storage initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your Azure Storage configuration.`
        )
      }
    } else {
      throw new Error(
        'Azure Storage is required but not configured. Please set VITE_AZURE_STORAGE_ACCOUNT_NAME and VITE_AZURE_STORAGE_ACCOUNT_KEY environment variables.'
      )
    }
  }

  /**
   * Determine if Azure Storage should be used based on environment
   */
  private shouldUseAzureStorage(): boolean {
    // Check environment variables
    const azureAccountName = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME
    const azureAccountKey = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_KEY
    const environment = import.meta.env.VITE_ENVIRONMENT

    // Use Azure in production or when explicitly configured
    if (environment === 'production' && azureAccountName && azureAccountKey) {
      return true
    }

    // Use Azure in development if explicitly configured
    if (azureAccountName && azureAccountKey) {
      return true
    }

    // Default to local storage for development
    return false
  }

  /**
   * Store image in Azure Storage only - no fallback to local storage
   */
  async storeImage(file: File): Promise<StoredImageResult> {
    const imageId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const timestamp = new Date().toISOString()

    if (!this.config.useAzureStorage || !this.azureService) {
      throw new Error(
        'Azure Storage is not configured. Please configure Azure Storage account and CORS settings. See docs/CONSOLE_WARNING_RESOLUTION.md for setup instructions.'
      )
    }

    return this.storeImageInAzure(file, imageId, timestamp)
  }

  /**
   * Store image in Azure Storage with SAS URL generation
   */
  private async storeImageInAzure(
    file: File,
    imageId: string,
    timestamp: string
  ): Promise<StoredImageResult> {
    if (!this.azureService) {
      throw new Error('Azure Storage service not initialized')
    }

    try {
      // Generate blob name with timestamp and random suffix for uniqueness
      const blobName = `${timestamp.split('T')[0]}/${imageId}.${this.getFileExtension(file.name)}`

      // Upload blob to Azure
      const uploadResult: AzureBlobUploadResponse =
        await this.azureService.uploadBlob(
          file,
          this.config.azureContainer,
          blobName,
          {
            originalName: file.name,
            mimeType: file.type,
            uploadedAt: timestamp,
            userId: 'uxp-user', // TODO: Get from IMS when available
            sessionId: imageId,
            width: '1024', // Default - could be extracted from image
            height: '1024',
            generationId: imageId,
            tags: 'uploaded,gallery',
          }
        )

      if (!uploadResult.success) {
        throw new Error(
          `Azure upload failed: ${uploadResult.errorMessage || 'Unknown error'}`
        )
      }

      // Note: SAS URL generation not available in browser environment
      // Using direct blob URL instead (requires public access or pre-generated SAS)
      const blobUrl = uploadResult.blobUrl

      const azureMetadata: AzureBlobMetadata = {
        containerName: this.config.azureContainer,
        blobName,
        sasUrl: blobUrl, // Using blob URL directly since SAS generation requires backend
        expiresAt: new Date(
          Date.now() + this.config.sasExpirationMinutes * 60 * 1000
        ),
        blobUrl: uploadResult.blobUrl,
        etag: uploadResult.etag,
        lastModified: uploadResult.lastModified,
      }

      const result: StoredImageResult = {
        id: imageId,
        blobUrl: blobUrl, // Use blob URL for display
        azureMetadata,
        isLocal: false,
        filename: file.name,
        contentType: file.type,
        size: file.size,
        timestamp,
      }

      console.warn('Gallery Storage: Image uploaded to Azure:', {
        id: imageId,
        blobName,
        blobUrl: blobUrl.substring(0, 100) + '...',
        size: file.size,
      })

      return result
    } catch (error) {
      console.error('Gallery Storage: Azure upload failed:', error)

      // No longer fallback to local storage - throw the error to the UI
      throw new Error(
        `Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your Azure Storage configuration and CORS settings.`
      )
    }
  }

  /**
   * Get stored image by ID - Azure Storage only
   */
  async getImage(_id: string): Promise<StoredImageResult | null> {
    // For Azure-only storage, we don't cache images locally
    // Images are accessed directly via their blob URLs
    // This method could be extended to fetch metadata from Azure if needed
    console.warn(
      'Gallery Storage: getImage not implemented for Azure-only mode'
    )
    return null
  }

  /**
   * Get all stored images - Azure Storage only
   */
  async getAllImages(): Promise<StoredImageResult[]> {
    if (!this.config.useAzureStorage || !this.azureService) {
      throw new Error(
        'Azure Storage is not configured. Cannot retrieve images without Azure Storage.'
      )
    }

    try {
      // List all blobs in the Azure container
      const blobs = await this.azureService.listBlobs(
        this.config.azureContainer
      )

      // Convert Azure blob info to StoredImageResult format
      const images: StoredImageResult[] = blobs.map(blob => ({
        id: blob.name,
        blobUrl: `https://${this.config.storageAccountName}.blob.core.windows.net/${this.config.azureContainer}/${blob.name}`,
        isLocal: false,
        filename: blob.customMetadata?.originalName || blob.name,
        contentType:
          blob.customMetadata?.mimeType || 'application/octet-stream',
        size: blob.properties?.contentLength || 0,
        timestamp:
          blob.properties?.lastModified?.toISOString() ||
          new Date().toISOString(),
        azureMetadata: {
          containerName: this.config.azureContainer,
          blobName: blob.name,
          sasUrl: `https://${this.config.storageAccountName}.blob.core.windows.net/${this.config.azureContainer}/${blob.name}`,
          expiresAt: new Date(
            Date.now() + this.config.sasExpirationMinutes * 60 * 1000
          ),
          blobUrl: `https://${this.config.storageAccountName}.blob.core.windows.net/${this.config.azureContainer}/${blob.name}`,
          etag: blob.properties?.etag,
          lastModified: blob.properties?.lastModified,
        },
      }))

      return images
    } catch (error) {
      console.error('Gallery Storage: Failed to list images from Azure:', error)
      throw new Error(
        `Failed to retrieve images: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Delete stored image from Azure Storage
   */
  async deleteImage(id: string): Promise<void> {
    if (!this.config.useAzureStorage || !this.azureService) {
      throw new Error(
        'Azure Storage is not configured. Cannot delete images without Azure Storage.'
      )
    }

    try {
      // Delete from Azure Storage
      await this.azureService.deleteBlob(this.config.azureContainer, id)
      console.warn('Gallery Storage: Image deleted from Azure:', { id })
    } catch (error) {
      console.error('Gallery Storage: Failed to delete from Azure:', error)
      throw new Error(
        `Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Refresh SAS URL for Azure blob if expired or about to expire
   */
  async refreshBlobUrl(id: string): Promise<string | null> {
    if (!this.config.useAzureStorage || !this.azureService) {
      return null
    }

    // For now, return a constructed blob URL
    // In a full implementation, this would fetch fresh SAS tokens from the backend
    return `https://${this.config.storageAccountName}.blob.core.windows.net/${this.config.azureContainer}/${id}`
  }

  /**
   * Check if Azure Storage is available and configured
   */
  isAzureStorageAvailable(): boolean {
    return this.config.useAzureStorage && this.azureService !== null
  }

  /**
   * Switch between Azure and local storage modes - now only supports Azure
   */
  async switchStorageMode(useAzure: boolean): Promise<void> {
    if (!useAzure) {
      throw new Error(
        'Local storage mode is no longer supported. Azure Storage is required.'
      )
    }

    if (useAzure && !this.azureService) {
      // Initialize Azure service
      try {
        this.azureService = createAzureSDKBlobService()
        this.config.useAzureStorage = true
        console.warn('Gallery Storage: Switched to Azure Storage mode')
      } catch (error) {
        console.error(
          'Gallery Storage: Failed to switch to Azure Storage:',
          error
        )
        throw error
      }
    }
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(filename: string): string {
    const extension = filename.split('.').pop()
    return extension || 'jpg'
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    // Clear any local references
    this.localImageCache.clear()
  }
}

/**
 * Create gallery storage service instance
 */
export function createGalleryStorageService(
  config?: Partial<GalleryStorageConfig>
): GalleryStorageService {
  return new GalleryStorageService(config)
}

// Export a default instance for use throughout the app
export const galleryStorageService = createGalleryStorageService()

export default GalleryStorageService
