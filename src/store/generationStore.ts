/**
 * Generation Store for Image Ge    setPrompt: (prompt: string) => void
    updateSettings: (settings: Partial<FireflyGenerationRequest>) => void
    startGeneration: () => void
        addGeneration: (result: GenerationResult) => {
          console.warn('Adding generation to store:', {
            id: result.id,
            imageUrl: result.imageUrl,
            status: result.status,
            prompt: result.metadata.prompt
          })
          set((state) => ({
            generationHistory: [result, ...state.generationHistory]
          }))
        }, () => void
    setGenerationProgress: (progress: number) => void
    addGeneration: (result: GenerationResult) => void
    selectImage: (id: string) => void
    clearSelection: () => void
    removeGeneration: (id: string) => void
    clearHistory: () => void
    duplicateGeneration: (id: string) => void
    setError: (error: string | null) => void
    clearError: () => void
    resetSession: () => voide Management
 * Handles current prompt, generation history, and selection state
 * Uses Zustand for state management with UXP-compatible local storage persistence
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { 
  GenerationResult, 
  FireflyRequest
} from '../types/firefly'
import { v4 as uuidv4 } from 'uuid'

// Store interface matching task requirements
export interface GenerationStore {
  // Core generation state
  currentPrompt: string
  currentSettings: Partial<FireflyRequest>
  isGenerating: boolean
  generationProgress: number
  
  // Generation results and history
  generationHistory: GenerationResult[]
  selectedImage: GenerationResult | null
  totalGenerations: number
  sessionId: string
  
  // UI and error state
  error: string | null
  lastError: number | null
  
  // Actions
  actions: {
    setPrompt: (prompt: string) => void
    updateSettings: (settings: Partial<FireflyRequest>) => void
    startGeneration: () => void
    stopGeneration: () => void
    setGenerationProgress: (progress: number) => void
    addGeneration: (result: GenerationResult) => void
    selectImage: (id: string) => void
    clearSelection: () => void
    removeGeneration: (id: string) => void
    clearHistory: () => void
    cleanupInvalidBlobUrls: () => void
    duplicateGeneration: (id: string) => void
    setError: (error: string | null) => void
    clearError: () => void
    resetSession: () => void
  }
}

// UXP-compatible storage implementation with localStorage
const createUXPStorage = () => {
  // Use localStorage for generation data (simple and reliable)
  return createJSONStorage(() => localStorage)
}

// Initial state
const initialState = {
  currentPrompt: '',
  currentSettings: {
    contentClass: 'photo' as const,
    aspectRatio: '16:9' as const,
    numVariations: 1
  },
  isGenerating: false,
  generationProgress: 0,
  generationHistory: [],
  selectedImage: null,
  sessionId: uuidv4(),
  totalGenerations: 0,
  error: null,
  lastError: null
}

// Create the generation store
export const useGenerationStore = create<GenerationStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      actions: {
        /**
         * Set the current prompt text
         */
        setPrompt(prompt: string): void {
          set({ currentPrompt: prompt, error: null })
        },

        /**
         * Update current generation settings
         */
        updateSettings(settings: Partial<FireflyRequest>): void {
          set((state) => ({
            currentSettings: {
              ...state.currentSettings,
              ...settings
            },
            error: null
          }))
        },

        /**
         * Start a new generation process
         */
        startGeneration(): void {
          const state = get()
          
          if (state.isGenerating) {
            return
          }

          if (!state.currentPrompt.trim()) {
            set({ error: 'Prompt cannot be empty' })
            return
          }

          set({
            isGenerating: true,
            generationProgress: 0,
            error: null
          })
        },

        /**
         * Update generation progress (0-100)
         */
        setGenerationProgress(progress: number): void {
          set({ generationProgress: Math.max(0, Math.min(100, progress)) })
        },

        /**
         * Stop generation process
         */
        stopGeneration(): void {
          set({ 
            isGenerating: false, 
            generationProgress: 0,
            error: null 
          })
        },

        /**
         * Add a new generation result to history
         */
        addGeneration(result: GenerationResult): void {
          console.warn('Adding image to generation store:', {
            id: result.id,
            imageUrl: result.imageUrl,
            isBlobUrl: result.imageUrl.startsWith('blob:'),
            isDataUrl: result.imageUrl.startsWith('data:'),
            urlType: result.imageUrl.startsWith('blob:') ? 'blob' : 
                     result.imageUrl.startsWith('data:') ? 'data' : 
                     result.imageUrl.startsWith('http') ? 'http' : 'unknown',
            prompt: result.metadata.prompt
          })
          
          set((state) => {
            const newHistory = [result, ...state.generationHistory]
            
            // Limit history to 100 items to prevent storage bloat
            if (newHistory.length > 100) {
              newHistory.splice(100)
            }

            return {
              generationHistory: newHistory,
              isGenerating: false,
              generationProgress: 100,
              totalGenerations: state.totalGenerations + 1,
              error: null,
              selectedImage: result // Auto-select the new generation
            }
          })
        },

        /**
         * Select an image by ID
         */
        selectImage(id: string): void {
          const state = get()
          const image = state.generationHistory.find(img => img.id === id)
          
          if (image) {
            set({ selectedImage: image, error: null })
          } else {
            set({ error: `Image with ID ${id} not found` })
          }
        },

        /**
         * Clear current selection
         */
        clearSelection(): void {
          set({ selectedImage: null })
        },

        /**
         * Remove a generation from history
         */
        removeGeneration(id: string): void {
          set((state) => {
            // Find the image to remove and clean up its blob URL
            const imageToRemove = state.generationHistory.find(img => img.id === id)
            if (imageToRemove?.imageUrl && imageToRemove.imageUrl.startsWith('blob:')) {
              URL.revokeObjectURL(imageToRemove.imageUrl)
              console.warn('Cleaned up blob URL for removed image:', imageToRemove.imageUrl)
            }
            
            const newHistory = state.generationHistory.filter(img => img.id !== id)
            const newSelected = state.selectedImage?.id === id ? null : state.selectedImage
            
            return {
              generationHistory: newHistory,
              selectedImage: newSelected
            }
          })
        },

        /**
         * Clean up invalid blob URLs (e.g., from different origins)
         */
        cleanupInvalidBlobUrls(): void {
          if (typeof window === 'undefined' || typeof window.location?.origin !== 'string') {
            console.warn('Skipping blob URL cleanup: window/location not available in current runtime')
            return
          }

          const currentOrigin = window.location.origin
          const canRevokeBlob = typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function'

          set((state) => {
            const validImages = state.generationHistory.filter(image => {
              // Keep data URLs and http URLs
              if (image.imageUrl.startsWith('data:') || image.imageUrl.startsWith('http')) {
                return true
              }
              
              // For blob URLs, try to validate them
              if (image.imageUrl.startsWith('blob:')) {
                // Check if blob URL is from current origin
                if (image.imageUrl.startsWith(`blob:${currentOrigin}`)) {
                  return true
                } else {
                  console.warn('Removing invalid blob URL from different origin:', {
                    imageId: image.id,
                    blobUrl: image.imageUrl,
                    currentOrigin
                  })
                  // Revoke the invalid blob URL if supported
                  if (canRevokeBlob) {
                    try {
                      URL.revokeObjectURL(image.imageUrl)
                    } catch (revokeError) {
                      console.warn('Failed to revoke blob URL during cleanup:', revokeError)
                    }
                  }
                  return false
                }
              }
              
              return true
            })
            
            const removedCount = state.generationHistory.length - validImages.length
            if (removedCount > 0) {
              console.warn(`Cleaned up ${removedCount} invalid blob URLs`)
            }
            
            return {
              generationHistory: validImages
            }
          })
        },

        /**
         * Clear all generation history
         */
        clearHistory(): void {
          set((state) => {
            // Clean up all blob URLs before clearing
            state.generationHistory.forEach(image => {
              if (image.imageUrl && image.imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(image.imageUrl)
                console.warn('Cleaned up blob URL:', image.imageUrl)
              }
            })
            
            return {
              generationHistory: [],
              selectedImage: null,
              totalGenerations: 0
            }
          })
        },

        /**
         * Duplicate a generation with a new ID
         */
        duplicateGeneration(id: string): void {
          const state = get()
          const original = state.generationHistory.find(img => img.id === id)
          
          if (original) {
            const duplicate: GenerationResult = {
              ...original,
              id: uuidv4(),
              timestamp: Date.now(),
              metadata: {
                ...original.metadata,
                timestamp: Date.now()
              }
            }
            
            state.actions.addGeneration(duplicate)
          } else {
            set({ error: `Cannot duplicate image with ID ${id}: not found` })
          }
        },

        /**
         * Set error state
         */
        setError(error: string | null): void {
          set({ 
            error, 
            lastError: error ? Date.now() : null,
            isGenerating: false 
          })
        },

        /**
         * Clear current error
         */
        clearError(): void {
          set({ error: null })
        },

        /**
         * Reset session (new session ID, clear temporary state)
         */
        resetSession(): void {
          set({
            sessionId: uuidv4(),
            currentPrompt: '',
            currentSettings: initialState.currentSettings,
            isGenerating: false,
            generationProgress: 0,
            selectedImage: null,
            error: null,
            lastError: null
          })
        }
      }
    }),
    {
      name: 'generation-storage', // localStorage key
      storage: createUXPStorage(),
      
      // Only persist essential data
      partialize: (state) => ({
        currentPrompt: state.currentPrompt,
        currentSettings: state.currentSettings,
        generationHistory: state.generationHistory,
        selectedImage: state.selectedImage,
        sessionId: state.sessionId,
        totalGenerations: state.totalGenerations,
        // Don't persist loading states or errors
      }),
      
      // Handle rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Reset any loading states on rehydration
          state.isGenerating = false
          state.generationProgress = 0
          state.error = null
          state.lastError = null
          
          // Validate selectedImage still exists in history
          if (state.selectedImage && !state.generationHistory.find(img => img.id === state.selectedImage?.id)) {
            state.selectedImage = null
          }
          
          // Clean up invalid blob URLs from different origins
          console.warn('Cleaning up invalid blob URLs on rehydration...')
          state.actions.cleanupInvalidBlobUrls()
        }
      },
      
      // Handle storage version changes
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // Migration from v0 to v1 if needed
          return persistedState
        }
        return persistedState
      }
    }
  )
)

// Convenience hooks for specific state slices
export const useCurrentPrompt = () => {
  return useGenerationStore((state) => state.currentPrompt)
}

export const useCurrentSettings = () => {
  return useGenerationStore((state) => state.currentSettings)
}

export const useIsGenerating = () => {
  return useGenerationStore((state) => state.isGenerating)
}

export const useGenerationProgress = () => {
  return useGenerationStore((state) => state.generationProgress)
}

export const useGenerationHistory = () => {
  return useGenerationStore((state) => state.generationHistory)
}

export const useSelectedImage = () => {
  return useGenerationStore((state) => state.selectedImage)
}

export const useGenerationActions = () => {
  return useGenerationStore((state) => state.actions)
}

export const useGenerationError = () => {
  return useGenerationStore((state) => state.error)
}

// Memoized stats selector to prevent infinite loops
export const useGenerationStats = () => {
  return useGenerationStore((state) => state.totalGenerations)
}

export default useGenerationStore