/**
 * Azure-Enhanced Generation Store
 * Extends the base generation store with automatic Azure Storage migration
 * UXP-compatible implementation without React hooks
 */

import { useGenerationStore } from '../store/generationStore'
import { createAzureStorageServices, createAzureEnabledAddGeneration } from '../services/azureStorageFactory'
import { IMSService } from '../services/ims/IMSService'
import type { GenerationResult } from '../types/firefly'
import { isAzureEnabled } from '../services/storageMode'

let azureServices: ReturnType<typeof createAzureStorageServices> | null = null
let azureEnabledAddGeneration: ((result: GenerationResult) => Promise<void>) | null = null
let isInitialized = false

/**
 * Initialize Azure Storage services once
 */
function initializeAzureServices(): void {
  if (azureServices || isInitialized) return
  
  isInitialized = true

  if (!isAzureEnabled()) {
    console.warn('⚙️ Azure Store: Skipping Azure service initialization - storage mode is local')
    return
  }

  try {
    console.warn('🔧 Azure Store: Initializing Azure Storage services...')
    
    // Create IMS service instance (you may need to get this from your auth store)
    const imsService = new IMSService({
      clientId: import.meta.env.VITE_IMS_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_IMS_CLIENT_SECRET || '',
      orgId: import.meta.env.VITE_IMS_ORG_ID || '',
      scopes: import.meta.env.VITE_IMS_SCOPES || '',
      imsUrl: import.meta.env.VITE_IMS_URL || 'https://ims-na1.adobelogin.com'
    })

    // Create Azure services
    azureServices = createAzureStorageServices(imsService, {
      containerName: 'uxp-images',
      enableAutoMigration: true,
      migrateInBackground: false, // Synchronous migration for immediate URL replacement
      maxConcurrentMigrations: 3
    })

    console.warn('✅ Azure Store: Azure Storage services initialized')
  } catch (error) {
    console.error('❌ Azure Store: Failed to initialize Azure services:', error)
  }
}

/**
 * Ensure Azure-enabled addGeneration is created
 */
function ensureAzureEnabledAddGeneration(originalAddGeneration: (result: GenerationResult) => void): void {
  if (azureEnabledAddGeneration || !azureServices) return

  try {
    // Create Azure-enabled addGeneration function
    azureEnabledAddGeneration = createAzureEnabledAddGeneration(
      azureServices.azureMigrationIntegration,
      originalAddGeneration
    )
    console.warn('✅ Azure Store: Azure-enabled addGeneration created')
  } catch (error) {
    console.error('❌ Azure Store: Failed to create Azure-enabled addGeneration:', error)
  }
}

/**
 * Hook that provides Azure-enhanced generation store actions
 */
export function useAzureGenerationStore() {
  const store = useGenerationStore()
  const originalAddGeneration = store.actions.addGeneration

  // Initialize Azure services on first call
  if (!isInitialized) {
    initializeAzureServices()
  }

  // Ensure Azure-enabled addGeneration is ready
  if (azureServices && !azureEnabledAddGeneration) {
    ensureAzureEnabledAddGeneration(originalAddGeneration)
  }

  // Return enhanced store with Azure migration
  return {
    ...store,
    actions: {
      ...store.actions,
      addGeneration: async (result: GenerationResult) => {
        if (azureEnabledAddGeneration) {
          console.warn('🔄 Azure Store: Using Azure-enabled addGeneration')
          await azureEnabledAddGeneration(result)
        } else {
          console.warn('⚠️ Azure Store: Azure services not ready, using original addGeneration')
          originalAddGeneration(result)
        }
      },
      // Add Azure-specific actions
      migrateExistingHistory: async () => {
        if (!azureServices) {
          console.warn('⚠️ Azure Store: Azure services not initialized for history migration')
          return
        }

        try {
          console.warn('🔄 Azure Store: Starting migration of existing history...')
          
          const migratedHistory = await azureServices.azureMigrationIntegration.migrateExistingResults(
            store.generationHistory
          )

          // Update the store with migrated results
          store.actions.clearHistory()
          migratedHistory.forEach(result => originalAddGeneration(result))
          
          console.warn('✅ Azure Store: History migration completed')
        } catch (error) {
          console.error('❌ Azure Store: History migration failed:', error)
        }
      },
      getAzureStats: async () => {
        if (!azureServices) {
          return { error: 'Azure services not initialized' }
        }

        try {
          return await azureServices.azureMigrationIntegration.getMigrationStats()
        } catch (error) {
          console.error('❌ Azure Store: Failed to get Azure stats:', error)
          return { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      }
    }
  }
}

/**
 * Hook for components that only need generation actions with Azure support
 */
export function useAzureGenerationActions() {
  const store = useAzureGenerationStore()
  return store.actions
}

/**
 * Hook for Azure-specific functionality
 */
export function useAzureStorageInfo() {
  return {
    isInitialized: !!azureServices,
    services: azureServices,
    containerName: 'uxp-images'
  }
}

/**
 * Direct access to Azure services (for advanced use cases)
 */
export function getAzureServices() {
  if (!azureServices) {
    initializeAzureServices()
  }
  return azureServices
}

export default useAzureGenerationStore