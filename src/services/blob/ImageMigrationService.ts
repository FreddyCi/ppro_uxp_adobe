/**
 * Image Migration Service
 * Handles migrating images from Firefly presigned URLs to Azure Storage
 * Replaces temporary URLs with permanent Azure blob URLs
 */

import type { GenerationResult } from '../../types/firefly'
import type { AzureSDKBlobService } from './AzureSDKBlobService'
import type { IIMSService } from '../ims/IMSService'

export interface ImageMigrationConfig {
  containerName: string
  generateUniqueNames: boolean
  preserveMetadata: boolean
  deleteSourceAfterMigration: boolean
  maxConcurrentMigrations: number
  timeoutPerImageMs: number
}

export interface MigrationResult {
  success: boolean
  originalUrl: string
  newAzureUrl?: string
  blobName?: string
  error?: string
  migrationTime: number
}

export interface BatchMigrationResult {
  totalImages: number
  successful: number
  failed: number
  results: MigrationResult[]
  totalTime: number
}

export class ImageMigrationService {
  private azureBlobService: AzureSDKBlobService
  private config: ImageMigrationConfig

  constructor(
    azureBlobService: AzureSDKBlobService,
    _imsService: IIMSService,
    config: Partial<ImageMigrationConfig> = {}
  ) {
    this.azureBlobService = azureBlobService
    this.config = {
      containerName: 'uxp-images',
      generateUniqueNames: true,
      preserveMetadata: true,
      deleteSourceAfterMigration: false, // Don't delete Firefly URLs
      maxConcurrentMigrations: 3,
      timeoutPerImageMs: 30000, // 30 seconds per image
      ...config
    }
  }

  /**
   * Migrate a single image from Firefly presigned URL to Azure Storage
   */
  async migrateImage(
    presignedUrl: string,
    originalMetadata: GenerationResult['metadata']
  ): Promise<MigrationResult> {
    const startTime = Date.now()
    
    try {
      console.warn('🔄 ImageMigration: Starting migration for image:', {
        url: presignedUrl.substring(0, 100) + '...',
        prompt: originalMetadata.prompt.substring(0, 50) + '...'
      })

      // 1. Download image from Firefly presigned URL
      const imageBlob = await this.downloadImageFromPresignedUrl(presignedUrl)
      
      console.warn('📥 ImageMigration: Downloaded image blob:', {
        size: imageBlob.size,
        type: imageBlob.type
      })

      // 2. Generate unique blob name
      const blobName = this.generateBlobName(originalMetadata)
      
      // 3. Prepare Azure metadata
      const azureMetadata = this.prepareAzureMetadata(originalMetadata)
      
      // 4. Upload to Azure Storage
      const uploadResult = await this.azureBlobService.uploadBlob(
        imageBlob,
        this.config.containerName,
        blobName,
        azureMetadata
      )
      
      if (!uploadResult.success) {
        throw new Error('Azure upload failed')
      }

      const migrationTime = Date.now() - startTime
      
      console.warn('✅ ImageMigration: Successfully migrated image:', {
        originalUrl: presignedUrl.substring(0, 50) + '...',
        newAzureUrl: uploadResult.blobUrl,
        blobName,
        migrationTime
      })

      return {
        success: true,
        originalUrl: presignedUrl,
        newAzureUrl: uploadResult.blobUrl,
        blobName,
        migrationTime
      }
      
    } catch (error) {
      const migrationTime = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      console.error('❌ ImageMigration: Failed to migrate image:', {
        url: presignedUrl.substring(0, 50) + '...',
        error: errorMessage,
        migrationTime
      })

      return {
        success: false,
        originalUrl: presignedUrl,
        error: errorMessage,
        migrationTime
      }
    }
  }

  /**
   * Migrate multiple images from generation results
   */
  async migrateGenerationResults(
    generationResults: GenerationResult[]
  ): Promise<BatchMigrationResult> {
    const startTime = Date.now()
    
    console.warn('🔄 ImageMigration: Starting batch migration:', {
      totalImages: generationResults.length,
      maxConcurrent: this.config.maxConcurrentMigrations
    })

    const results: MigrationResult[] = []
    let successful = 0
    let failed = 0

    // Process images in batches to control concurrency
    for (let i = 0; i < generationResults.length; i += this.config.maxConcurrentMigrations) {
      const batch = generationResults.slice(i, i + this.config.maxConcurrentMigrations)
      
      const batchPromises = batch.map(result => 
        this.migrateImage(result.imageUrl, result.metadata)
      )
      
      const batchResults = await Promise.all(batchPromises)
      
      for (const result of batchResults) {
        results.push(result)
        if (result.success) {
          successful++
        } else {
          failed++
        }
      }
    }

    const totalTime = Date.now() - startTime
    
    console.warn('📊 ImageMigration: Batch migration completed:', {
      totalImages: generationResults.length,
      successful,
      failed,
      totalTime
    })

    return {
      totalImages: generationResults.length,
      successful,
      failed,
      results,
      totalTime
    }
  }

  /**
   * Update generation results with new Azure URLs
   */
  updateGenerationResultsWithAzureUrls(
    generationResults: GenerationResult[],
    migrationResults: MigrationResult[]
  ): GenerationResult[] {
    const urlMapping = new Map<string, string>()
    
    // Create mapping from original URL to Azure URL
    migrationResults.forEach(result => {
      if (result.success && result.newAzureUrl) {
        urlMapping.set(result.originalUrl, result.newAzureUrl)
      }
    })

    // Update generation results with new URLs
    return generationResults.map(result => {
      const newAzureUrl = urlMapping.get(result.imageUrl)
      
      if (newAzureUrl) {
        console.warn('🔄 ImageMigration: Updating result with Azure URL:', {
          originalUrl: result.imageUrl.substring(0, 50) + '...',
          newUrl: newAzureUrl
        })
        
        return {
          ...result,
          imageUrl: newAzureUrl, // Replace with Azure URL
          downloadUrl: newAzureUrl, // Update download URL too
          metadata: {
            ...result.metadata,
            azureBlobUrl: newAzureUrl,
            migratedAt: new Date(),
            originalFireflyUrl: result.imageUrl // Keep reference to original
          },
          status: 'stored' as const // Update status to indicate permanent storage
        }
      }
      
      return result // Return unchanged if migration failed
    })
  }

  /**
   * Download image from Firefly presigned URL
   */
  private async downloadImageFromPresignedUrl(presignedUrl: string): Promise<Blob> {
    try {
      const response = await fetch(presignedUrl, {
        method: 'GET',
        headers: {
          'Accept': 'image/*'
        }
      })

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`)
      }

      const blob = await response.blob()
      
      // Validate that we got an image
      if (!blob.type.startsWith('image/')) {
        console.warn('⚠️ ImageMigration: Downloaded blob is not an image:', blob.type)
      }

      return blob
    } catch (error) {
      console.error('❌ ImageMigration: Failed to download from presigned URL:', error)
      throw new Error(`Failed to download image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate unique blob name for Azure Storage
   */
  private generateBlobName(metadata: GenerationResult['metadata']): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const randomId = Math.random().toString(36).substring(2, 8)
    
    // Create a safe filename from the prompt
    const promptSlug = metadata.prompt
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .substring(0, 30) // Limit length
      
    const extension = metadata.filename?.split('.').pop() || 'jpg'
    
    if (this.config.generateUniqueNames) {
      return `firefly-${promptSlug}-${timestamp}-${randomId}.${extension}`
    } else {
      return metadata.filename || `firefly-${timestamp}.${extension}`
    }
  }

  /**
   * Prepare metadata for Azure Storage
   */
  private prepareAzureMetadata(
    metadata: GenerationResult['metadata']
  ): Record<string, string> {
    const azureMetadata: Record<string, string> = {}

    if (this.config.preserveMetadata) {
      // Convert all metadata to strings for Azure Storage
      azureMetadata.originalPrompt = metadata.prompt
      azureMetadata.contentClass = metadata.contentClass || ''
      azureMetadata.fireflyModel = metadata.model || 'firefly-v3'
      azureMetadata.fireflyVersion = metadata.version || 'v3'
      azureMetadata.generationSeed = metadata.seed?.toString() || ''
      azureMetadata.imageSize = metadata.size?.toString() || ''
      azureMetadata.style = metadata.style?.toString() || ''
      azureMetadata.userId = metadata.userId || ''
      azureMetadata.sessionId = metadata.sessionId || ''
      azureMetadata.jobId = metadata.jobId || ''
      azureMetadata.originalFilename = metadata.filename || ''
      azureMetadata.contentType = metadata.contentType || 'image/jpeg'
      azureMetadata.fileSize = metadata.fileSize?.toString() || ''
      const generatedAtDate =
        typeof metadata.timestamp === 'number' && !Number.isNaN(metadata.timestamp)
          ? new Date(metadata.timestamp)
          : new Date()
      azureMetadata.generatedAt = generatedAtDate.toISOString()
      azureMetadata.migratedAt = new Date().toISOString()
      azureMetadata.source = 'firefly-migration'
      azureMetadata.migrationService = 'ImageMigrationService'
    }

    return azureMetadata
  }

  /**
   * Verify Azure blob accessibility
   */
  async verifyAzureBlobAccess(blobUrl: string): Promise<boolean> {
    try {
      const response = await fetch(blobUrl, {
        method: 'HEAD' // Just check headers, don't download
      })
      
      return response.ok
    } catch (error) {
      console.error('❌ ImageMigration: Failed to verify Azure blob access:', error)
      return false
    }
  }

  /**
   * Get migration statistics
   */
  async getMigrationStats(containerName?: string): Promise<{
    totalMigratedImages: number
    totalStorageUsed: number
    migrationsByDate: Record<string, number>
  }> {
    try {
      const container = containerName || this.config.containerName
      const blobs = await this.azureBlobService.listBlobs(container, 'firefly-')
      
      let totalStorageUsed = 0
      const migrationsByDate: Record<string, number> = {}
      
      for (const blob of blobs) {
        totalStorageUsed += blob.properties?.contentLength || 0
        
        // Extract date from blob metadata if available
        const metadata = await this.azureBlobService.getBlobMetadata(container, blob.name)
        const migratedAt = metadata.migratedAt
        
        if (migratedAt) {
          const date = new Date(migratedAt).toISOString().split('T')[0]
          migrationsByDate[date] = (migrationsByDate[date] || 0) + 1
        }
      }
      
      return {
        totalMigratedImages: blobs.length,
        totalStorageUsed,
        migrationsByDate
      }
    } catch (error) {
      console.error('❌ ImageMigration: Failed to get migration stats:', error)
      return {
        totalMigratedImages: 0,
        totalStorageUsed: 0,
        migrationsByDate: {}
      }
    }
  }

  /**
   * Clean up old Firefly images (if deleteSourceAfterMigration is enabled)
   */
  async cleanupFireflyImages(migrationResults: MigrationResult[]): Promise<void> {
    if (!this.config.deleteSourceAfterMigration) {
      console.warn('🧹 ImageMigration: Source cleanup disabled')
      return
    }

    const successfulMigrations = migrationResults.filter(result => result.success)
    
    console.warn('🧹 ImageMigration: Cleaning up Firefly images:', {
      count: successfulMigrations.length
    })

    // Note: Firefly presigned URLs are temporary and will expire naturally
    // No explicit cleanup needed for presigned URLs
    console.warn('✅ ImageMigration: Firefly URLs will expire automatically')
  }
}

/**
 * Factory function to create ImageMigrationService
 */
export function createImageMigrationService(
  azureBlobService: AzureSDKBlobService,
  imsService: IIMSService,
  config: Partial<ImageMigrationConfig> = {}
): ImageMigrationService {
  return new ImageMigrationService(azureBlobService, imsService, config)
}

export default ImageMigrationService