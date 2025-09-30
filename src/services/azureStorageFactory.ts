/**
 * Azure Image Storage Service Factory
 * Creates and configures all Azure-related services for automatic image migration
 */

import { createAzureSDKBlobService } from './blob/AzureSDKBlobService'
import { createImageMigrationService } from './blob/ImageMigrationService'
import { createAzureMigrationIntegration } from './AzureMigrationIntegration'
import type { IIMSService } from './ims/IMSService'
import type { GenerationResult } from '../types/firefly'
import { isAzureEnabled } from './storageMode'

export interface AzureStorageServices {
  azureBlobService: ReturnType<typeof createAzureSDKBlobService>
  imageMigrationService: ReturnType<typeof createImageMigrationService>
  azureMigrationIntegration: ReturnType<typeof createAzureMigrationIntegration>
}

export interface AzureStorageConfig {
  containerName?: string
  enableAutoMigration?: boolean
  migrateInBackground?: boolean
  maxConcurrentMigrations?: number
}

/**
 * Create configured Azure storage services
 */
export function createAzureStorageServices(
  imsService: IIMSService,
  config: AzureStorageConfig = {}
): AzureStorageServices {
  if (!isAzureEnabled()) {
    throw new Error('Azure storage services are disabled in local storage mode')
  }

  console.warn('🔧 Azure Storage: Initializing services...')

  // Create Azure Blob Service with environment configuration
  const azureBlobService = createAzureSDKBlobService(imsService)
  
  // Create Image Migration Service
  const imageMigrationService = createImageMigrationService(
    azureBlobService,
    imsService,
    {
      containerName: config.containerName || 'uxp-images',
      generateUniqueNames: true,
      preserveMetadata: true,
      maxConcurrentMigrations: config.maxConcurrentMigrations || 3
    }
  )

  // Create Azure Migration Integration
  const azureMigrationIntegration = createAzureMigrationIntegration(
    azureBlobService,
    imageMigrationService,
    {
      enableAutoMigration: config.enableAutoMigration ?? true,
      migrateOnGeneration: true,
      migrateInBackground: config.migrateInBackground ?? false, // Synchronous by default for immediate URL replacement
      containerName: config.containerName || 'uxp-images'
    }
  )

  console.warn('✅ Azure Storage: Services initialized successfully')

  return {
    azureBlobService,
    imageMigrationService,
    azureMigrationIntegration
  }
}

/**
 * Enhanced addGeneration function that automatically migrates to Azure
 */
export function createAzureEnabledAddGeneration(
  azureMigrationIntegration: ReturnType<typeof createAzureMigrationIntegration>,
  originalAddGeneration: (result: GenerationResult) => void
) {
  if (!isAzureEnabled()) {
    return async (result: GenerationResult): Promise<void> => {
      originalAddGeneration(result)
    }
  }

  return async (result: GenerationResult): Promise<void> => {
    console.warn('🔄 Azure Storage: Processing generation result for Azure migration...')

    try {
      // Migrate to Azure Storage and get updated result with Azure URLs
      const migratedResult = await azureMigrationIntegration.processGenerationResult(result)
      
      console.warn('✅ Azure Storage: Migration completed, adding to store:', {
        originalUrl: result.imageUrl.substring(0, 50) + '...',
        azureUrl: migratedResult.imageUrl.substring(0, 50) + '...',
        status: migratedResult.status
      })
      
      // Add the migrated result (with Azure URLs) to the store
      originalAddGeneration(migratedResult)
      
    } catch (error) {
      console.error('❌ Azure Storage: Migration failed, adding original result:', error)
      
      // Fall back to original result if migration fails
      originalAddGeneration(result)
    }
  }
}

/**
 * Migrate existing generation history to Azure
 */
export async function migrateExistingGenerationHistory(
  azureMigrationIntegration: ReturnType<typeof createAzureMigrationIntegration>,
  generationHistory: GenerationResult[],
  updateHistory: (newHistory: GenerationResult[]) => void
): Promise<void> {
  if (!isAzureEnabled()) {
    updateHistory(generationHistory)
    return
  }

  console.warn('🔄 Azure Storage: Migrating existing generation history...')

  try {
    const migratedHistory = await azureMigrationIntegration.migrateExistingResults(generationHistory)
    
    console.warn('✅ Azure Storage: History migration completed:', {
      originalCount: generationHistory.length,
      migratedCount: migratedHistory.length
    })
    
    updateHistory(migratedHistory)
    
  } catch (error) {
    console.error('❌ Azure Storage: History migration failed:', error)
  }
}

/**
 * Check if all services are properly configured
 */
export async function validateAzureStorageConfiguration(
  services: AzureStorageServices
): Promise<{
  isValid: boolean
  issues: string[]
  recommendations: string[]
}> {
  if (!isAzureEnabled()) {
    return {
      isValid: true,
      issues: [],
      recommendations: ['Azure storage is disabled in local mode; no validation required']
    }
  }

  const issues: string[] = []
  const recommendations: string[] = []

  try {
    // Test Azure Blob Service connection
    const connectionTest = await services.azureBlobService.testConnection()
    if (!connectionTest) {
      issues.push('Azure Blob Service connection failed')
      recommendations.push('Check Azure Storage account credentials and network connectivity')
    }

    // Check container configuration
    const stats = await services.azureMigrationIntegration.getMigrationStats()
    console.warn('📊 Azure Storage: Current stats:', stats)

    // Validate environment variables
    const requiredEnvVars = [
      'VITE_AZURE_STORAGE_ACCOUNT_NAME',
      'VITE_BACKEND_URL'
    ]

    for (const envVar of requiredEnvVars) {
      if (!import.meta.env[envVar]) {
        issues.push(`Missing environment variable: ${envVar}`)
        recommendations.push(`Set ${envVar} in your .env file`)
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    }

  } catch (error) {
    issues.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return {
      isValid: false,
      issues,
      recommendations: ['Check Azure Storage configuration and try again']
    }
  }
}

export default createAzureStorageServices