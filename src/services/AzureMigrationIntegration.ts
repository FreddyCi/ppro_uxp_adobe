/**
 * Azure Migration Integration Service
 * Automatically migrates Firefly images to Azure Storage when they're added to the generation store
 */

import type { GenerationResult } from '../types/firefly'
import type { AzureSDKBlobService } from './blob/AzureSDKBlobService'
import type { ImageMigrationService } from './blob/ImageMigrationService'

export interface AzureMigrationConfig {
  enableAutoMigration: boolean
  migrateOnGeneration: boolean
  migrateInBackground: boolean
  containerName: string
  maxRetries: number
  retryDelayMs: number
}

export class AzureMigrationIntegration {
  private azureBlobService: AzureSDKBlobService
  private imageMigrationService: ImageMigrationService
  private config: AzureMigrationConfig
  private migrationQueue: GenerationResult[] = []
  private isProcessingQueue = false

  constructor(
    azureBlobService: AzureSDKBlobService,
    imageMigrationService: ImageMigrationService,
    config: Partial<AzureMigrationConfig> = {}
  ) {
    this.azureBlobService = azureBlobService
    this.imageMigrationService = imageMigrationService
    this.config = {
      enableAutoMigration: true,
      migrateOnGeneration: true,
      migrateInBackground: true,
      containerName: 'uxp-images',
      maxRetries: 3,
      retryDelayMs: 5000,
      ...config
    }

    // Ensure container exists
    this.initializeContainer()
  }

  /**
   * Initialize Azure container for image storage
   */
  private async initializeContainer(): Promise<void> {
    try {
      await this.azureBlobService.ensureContainer(this.config.containerName)
      console.warn('✅ Azure Migration: Container initialized:', this.config.containerName)
    } catch (error) {
      // Check if the error is because container already exists (409 conflict)
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 409) {
        console.warn('ℹ️ Azure Migration: Container already exists:', this.config.containerName)
        return
      }
      
      // Log the error but don't throw - the container might exist and be accessible for operations
      console.warn('⚠️ Azure Migration: Container initialization had issues, but continuing:', {
        containerName: this.config.containerName,
        error: error instanceof Error ? error.message : String(error)
      })
      
      // Don't throw the error as this will prevent the entire migration system from working
      // The container might already exist and be accessible for read/write operations
    }
  }

  /**
   * Process a single generation result - migrate from Firefly to Azure
   */
  async processGenerationResult(result: GenerationResult): Promise<GenerationResult> {
    if (!this.config.enableAutoMigration) {
      console.warn('🔄 Azure Migration: Auto-migration disabled, returning original result')
      return result
    }

    // Check if this is a Firefly presigned URL that needs migration
    if (!this.isFireflyPresignedUrl(result.imageUrl)) {
      console.warn('🔄 Azure Migration: Not a Firefly URL, skipping migration:', {
        url: result.imageUrl.substring(0, 50) + '...',
        urlType: this.getUrlType(result.imageUrl)
      })
      return result
    }

    try {
      console.warn('🔄 Azure Migration: Starting migration for generation result:', {
        id: result.id,
        prompt: result.metadata.prompt.substring(0, 50) + '...',
        originalUrl: result.imageUrl.substring(0, 50) + '...'
      })

      // Migrate the image to Azure
      const migrationResult = await this.imageMigrationService.migrateImage(
        result.imageUrl,
        result.metadata
      )

      if (migrationResult.success && migrationResult.newAzureUrl) {
        // Update the generation result with Azure URL
        const updatedResult: GenerationResult = {
          ...result,
          imageUrl: migrationResult.newAzureUrl,
          downloadUrl: migrationResult.newAzureUrl,
          metadata: {
            ...result.metadata,
            // Store Azure info in custom fields (extend metadata as needed)
            userId: result.metadata.userId, // Preserve existing field
            sessionId: `${result.metadata.sessionId || ''}-azure-migrated`,
            timestamp: new Date() // Update timestamp
          },
          status: 'stored' as const
        }

        console.warn('✅ Azure Migration: Successfully migrated generation result:', {
          id: result.id,
          originalUrl: result.imageUrl.substring(0, 50) + '...',
          newAzureUrl: migrationResult.newAzureUrl,
          migrationTime: migrationResult.migrationTime
        })

        return updatedResult
      } else {
        throw new Error(migrationResult.error || 'Migration failed')
      }

    } catch (error) {
      console.error('❌ Azure Migration: Failed to migrate generation result:', {
        id: result.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      // Return original result if migration fails
      return result
    }
  }

  /**
   * Process generation result with background queue
   */
  async processGenerationResultWithQueue(result: GenerationResult): Promise<GenerationResult> {
    if (!this.config.migrateInBackground) {
      // Process synchronously
      return this.processGenerationResult(result)
    }

    // Add to background queue
    this.migrationQueue.push(result)
    
    // Start processing queue if not already running
    if (!this.isProcessingQueue) {
      this.processQueue()
    }

    // Return original result immediately (will be updated when migration completes)
    return result
  }

  /**
   * Process the migration queue in the background
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue) {
      return
    }

    this.isProcessingQueue = true
    console.warn('🔄 Azure Migration: Starting background queue processing')

    while (this.migrationQueue.length > 0) {
      const result = this.migrationQueue.shift()
      if (!result) continue

      try {
        const migratedResult = await this.processGenerationResult(result)
        
        // Emit event to update the store (could be implemented with event system)
        this.notifyMigrationComplete(result.id, migratedResult)
        
      } catch (error) {
        console.error('❌ Azure Migration: Queue processing error:', error)
      }
    }

    this.isProcessingQueue = false
    console.warn('✅ Azure Migration: Background queue processing completed')
  }

  /**
   * Notify that migration is complete (placeholder for event system)
   */
  private notifyMigrationComplete(originalId: string, migratedResult: GenerationResult): void {
    console.warn('📢 Azure Migration: Migration completed for result:', {
      originalId,
      newUrl: migratedResult.imageUrl
    })

    // In a real implementation, you could emit a custom event here
    // window.dispatchEvent(new CustomEvent('azure-migration-complete', { detail: { originalId, migratedResult } }))
  }

  /**
   * Check if URL is a Firefly presigned URL
   */
  private isFireflyPresignedUrl(url: string): boolean {
    // Firefly URLs typically contain adobe.com or firefly-specific patterns
    return (
      url.includes('firefly') ||
      url.includes('adobe.com') ||
      url.includes('adobeio-static.net') ||
      url.includes('X-Amz-Signature') || // AWS presigned URL pattern
      url.includes('sig=') // Azure SAS pattern
    ) && !url.includes('blob.core.windows.net') // Not already Azure
  }

  /**
   * Get URL type for debugging
   */
  private getUrlType(url: string): string {
    if (url.startsWith('blob:')) return 'blob'
    if (url.startsWith('data:')) return 'data'
    if (url.includes('blob.core.windows.net')) return 'azure'
    if (url.includes('firefly')) return 'firefly'
    if (url.includes('adobe.com')) return 'adobe'
    if (url.startsWith('http')) return 'http'
    return 'unknown'
  }

  /**
   * Batch migrate existing generation results
   */
  async migrateExistingResults(results: GenerationResult[]): Promise<GenerationResult[]> {
    console.warn('🔄 Azure Migration: Starting batch migration of existing results:', {
      count: results.length
    })

    const fireflyResults = results.filter(result => this.isFireflyPresignedUrl(result.imageUrl))
    
    if (fireflyResults.length === 0) {
      console.warn('✅ Azure Migration: No Firefly URLs found to migrate')
      return results
    }

    console.warn('🔄 Azure Migration: Found Firefly URLs to migrate:', {
      total: results.length,
      fireflyUrls: fireflyResults.length
    })

    const migrationResults = await this.imageMigrationService.migrateGenerationResults(fireflyResults)
    const updatedResults = this.imageMigrationService.updateGenerationResultsWithAzureUrls(
      results,
      migrationResults.results
    )

    console.warn('✅ Azure Migration: Batch migration completed:', {
      totalResults: results.length,
      migrated: migrationResults.successful,
      failed: migrationResults.failed,
      time: migrationResults.totalTime
    })

    return updatedResults
  }

  /**
   * Get migration statistics
   */
  async getMigrationStats(): Promise<{
    queueLength: number
    isProcessing: boolean
    containerStats: {
      totalMigratedImages: number
      totalStorageUsed: number
      migrationsByDate: Record<string, number>
    }
  }> {
    const containerStats = await this.imageMigrationService.getMigrationStats()
    
    return {
      queueLength: this.migrationQueue.length,
      isProcessing: this.isProcessingQueue,
      containerStats
    }
  }

  /**
   * Force process all queued migrations
   */
  async flushQueue(): Promise<void> {
    await this.processQueue()
  }

  /**
   * Clear the migration queue
   */
  clearQueue(): void {
    this.migrationQueue = []
    console.warn('🧹 Azure Migration: Queue cleared')
  }

  /**
   * Enable/disable auto migration
   */
  setAutoMigration(enabled: boolean): void {
    this.config.enableAutoMigration = enabled
    console.warn('⚙️ Azure Migration: Auto-migration', enabled ? 'enabled' : 'disabled')
  }
}

/**
 * Factory function to create Azure Migration Integration
 */
export function createAzureMigrationIntegration(
  azureBlobService: AzureSDKBlobService,
  imageMigrationService: ImageMigrationService,
  config: Partial<AzureMigrationConfig> = {}
): AzureMigrationIntegration {
  return new AzureMigrationIntegration(azureBlobService, imageMigrationService, config)
}

export default AzureMigrationIntegration