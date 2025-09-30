/**
 * Authentication Store for IMS OAuth Management
 * Handles authentication state, token persistence, and auto-refresh logic
 * Uses Zustand for state management with UXP-compatible local storage persistence
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createIMSService, type IIMSService } from '../services/ims/IMSService'

// Store interface matching task requirements
export interface AuthStore {
  // Core auth state
  accessToken: string | null
  tokenExpiry: Date | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Additional state for better UX
  userId: string | null
  lastLoginAttempt: Date | null
  refreshCount: number
  
  // Service connections status
  services: {
    firefly: AuthStoreServiceConnectionState
    gemini: AuthStoreServiceConnectionState
    azureBlob: AuthStoreServiceConnectionState
    premiere: AuthStoreServiceConnectionState
  }
  
  // Actions
  actions: {
    login(): Promise<void>
    logout(): void
    refreshToken(): Promise<void>
    setLoading(loading: boolean, error?: string | null): void
    updateServiceConnection(service: keyof AuthStore['services'], state: Partial<AuthStoreServiceConnectionState>): void
    clearError(): void
    checkAuthStatus(): boolean
    scheduleTokenRefresh(): void
  }
}

export interface AuthStoreServiceConnectionState {
  connected: boolean
  lastConnected: Date | null
  error: string | null
  retryCount: number
}

// UXP-compatible storage implementation
const createUXPStorage = () => {
  return createJSONStorage(() => ({
    getItem: (key: string) => {
      try {
        // In UXP environment, use localStorage
        return window.localStorage?.getItem(key) || null
      } catch (error) {
        console.warn('Failed to read from localStorage:', error)
        return null
      }
    },
    setItem: (key: string, value: string) => {
      try {
        window.localStorage?.setItem(key, value)
      } catch (error) {
        console.warn('Failed to write to localStorage:', error)
      }
    },
    removeItem: (key: string) => {
      try {
        window.localStorage?.removeItem(key)
      } catch (error) {
        console.warn('Failed to remove from localStorage:', error)
      }
    }
  }))
}

// Initial state
const initialState = {
  accessToken: null,
  tokenExpiry: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  userId: null,
  lastLoginAttempt: null,
  refreshCount: 0,
  services: {
    firefly: {
      connected: false,
      lastConnected: null,
      error: null,
      retryCount: 0
    },
    gemini: {
      connected: false,
      lastConnected: null,
      error: null,
      retryCount: 0
    },
    azureBlob: {
      connected: false,
      lastConnected: null,
      error: null,
      retryCount: 0
    },
    premiere: {
      connected: false,
      lastConnected: null,
      error: null,
      retryCount: 0
    }
  }
}

// Utility function to ensure Date object
const ensureDateObject = (date: Date | string | null): Date | null => {
  if (!date) return null
  return date instanceof Date ? date : new Date(date)
}

// IMS service instance
let imsService: IIMSService | null = null

// Get IMS service instance
const getIMSService = (): IIMSService => {
  if (!imsService) {
    imsService = createIMSService()
  }
  return imsService
}

export const getIMSServiceInstance = (): IIMSService => getIMSService()

// Auto-refresh timer
let refreshTimer: NodeJS.Timeout | null = null

// Create the auth store
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      actions: {
        /**
         * Login using IMS OAuth client credentials flow
         */
        async login(): Promise<void> {
          const store = get()
          
          // Prevent concurrent login attempts
          if (store.isLoading) {
            return
          }

          set({ 
            isLoading: true, 
            error: null, 
            lastLoginAttempt: new Date() 
          })

          try {
            const ims = getIMSService()
            const accessToken = await ims.getAccessToken()
            const tokenInfo = ims.getTokenInfo()

            set({
              accessToken,
              tokenExpiry: ensureDateObject(tokenInfo.expiresAt),
              isAuthenticated: true,
              isLoading: false,
              error: null,
              userId: 'ims-user', // Could be extracted from token if needed
              refreshCount: 0
            })

            // Start auto-refresh timer
            store.actions.scheduleTokenRefresh()

            // Authentication successful

          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
            
            set({
              accessToken: null,
              tokenExpiry: null,
              isAuthenticated: false,
              isLoading: false,
              error: errorMessage,
              userId: null
            })

            console.error('Authentication failed:', errorMessage)
            throw error
          }
        },

        /**
         * Logout and clear authentication state
         */
        logout(): void {
          // Clear refresh timer
          if (refreshTimer) {
            clearTimeout(refreshTimer)
            refreshTimer = null
          }

          // Clear IMS token cache
          if (imsService) {
            imsService.clearTokenCache()
          }

          set({
            ...initialState,
            actions: get().actions // Preserve actions
          })

          // User logged out
        },

        /**
         * Refresh the access token
         */
        async refreshToken(): Promise<void> {
          const store = get()
          
          if (store.isLoading) {
            return
          }

          set({ isLoading: true, error: null })

          try {
            const ims = getIMSService()
            const accessToken = await ims.refreshToken()
            const tokenInfo = ims.getTokenInfo()

            set({
              accessToken,
              tokenExpiry: ensureDateObject(tokenInfo.expiresAt),
              isAuthenticated: true,
              isLoading: false,
              error: null,
              refreshCount: store.refreshCount + 1
            })

            // Reschedule next refresh
            store.actions.scheduleTokenRefresh()

            // Token refreshed successfully

          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Token refresh failed'
            
            set({
              accessToken: null,
              tokenExpiry: null,
              isAuthenticated: false,
              isLoading: false,
              error: errorMessage
            })

            console.error('Token refresh failed:', errorMessage)
            throw error
          }
        },

        /**
         * Set loading state with optional error
         */
        setLoading(loading: boolean, error: string | null = null): void {
          set({ isLoading: loading, error })
        },

        /**
         * Update service connection status
         */
        updateServiceConnection(
          service: keyof AuthStore['services'], 
          state: Partial<AuthStoreServiceConnectionState>
        ): void {
          set((current) => ({
            services: {
              ...current.services,
              [service]: {
                ...current.services[service],
                ...state,
                lastConnected: state.connected ? new Date() : current.services[service].lastConnected
              }
            }
          }))
        },

        /**
         * Clear current error
         */
        clearError(): void {
          set({ error: null })
        },

        /**
         * Check if user is currently authenticated
         */
        /**
         * Check if the current authentication is valid
         */
        checkAuthStatus(): boolean {
          const store = get()
          
          if (!store.accessToken || !store.tokenExpiry) {
            return false
          }

          // Ensure tokenExpiry is a Date object (handle deserialization from localStorage)
          const tokenExpiry = ensureDateObject(store.tokenExpiry)
          
          if (!tokenExpiry) {
            return false
          }

          // Check if token is expired (with 1 minute buffer)
          const now = new Date()
          const expiryWithBuffer = new Date(tokenExpiry.getTime() - 60000) // 1 minute buffer
          
          if (now >= expiryWithBuffer) {
            // Token expired, attempting refresh
            // Trigger refresh in background
            store.actions.refreshToken().catch(console.error)
            return false
          }

          return true
        },

        /**
         * Schedule automatic token refresh
         */
        scheduleTokenRefresh(): void {
          const store = get()
          
          // Clear existing timer
          if (refreshTimer) {
            clearTimeout(refreshTimer)
          }

          if (!store.tokenExpiry) {
            return
          }

          // Schedule refresh 5 minutes before expiry
          const now = new Date()
          const refreshTime = new Date(store.tokenExpiry.getTime() - (5 * 60 * 1000)) // 5 minutes before expiry
          const timeUntilRefresh = refreshTime.getTime() - now.getTime()

          if (timeUntilRefresh > 0) {
            refreshTimer = setTimeout(() => {
              // Auto-refreshing token
              store.actions.refreshToken().catch(console.error)
            }, timeUntilRefresh)

            // Token refresh scheduled
          } else {
            // Token needs immediate refresh
            store.actions.refreshToken().catch(console.error)
          }
        }
      }
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createUXPStorage(),
      
      // Only persist essential auth data
      partialize: (state) => ({
        accessToken: state.accessToken,
        tokenExpiry: state.tokenExpiry,
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        refreshCount: state.refreshCount,
        // Don't persist loading states or errors
        // Don't persist service connections (they should reconnect on startup)
      }),
      
      // Handle rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Auth store rehydrated from storage
          
          // Validate persisted token on rehydration
          if (state.isAuthenticated && state.accessToken && state.tokenExpiry) {
            const isValid = state.actions.checkAuthStatus()
            if (!isValid) {
              // Persisted token is invalid, clearing auth state
              state.actions.logout()
            } else {
              // Persisted token is valid, scheduling refresh
              state.actions.scheduleTokenRefresh()
            }
          }
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

// Export types for consumers are already exported above

// Hook for checking authentication status
export const useIsAuthenticated = () => {
  return useAuthStore((state) => state.isAuthenticated && state.actions.checkAuthStatus())
}

// Hook for getting auth actions
export const useAuthActions = () => {
  return useAuthStore((state) => state.actions)
}

// Hook for getting auth loading state
export const useAuthLoading = () => {
  return useAuthStore((state) => state.isLoading)
}

// Hook for getting auth error
export const useAuthError = () => {
  return useAuthStore((state) => state.error)
}

// Cleanup on module unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer)
    }
  })
}

export default useAuthStore