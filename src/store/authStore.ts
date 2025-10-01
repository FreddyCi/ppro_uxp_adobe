/**
 * Authentication Store for IMS OAuth Management
 * Handles authentication state, token persistence, and auto-refresh logic
 * Uses Zustand for state management with UXP-compatible local storage persistence
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createIMSService, type IIMSService } from '../services/ims/IMSService'
import type { IMSTokenValidation } from '../types/ims'

// Authentication status state machine
export type AuthStatus = 'idle' | 'checking' | 'authenticated' | 'unauthenticated' | 'error'

// Store interface matching task requirements
export interface AuthStore {
  // Core auth state
  status: AuthStatus
  accessToken: string | null
  tokenExpiry: Date | null
  expiresAt: Date | null
  secondsUntilExpiry: number
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Additional state for better UX
  userId: string | null
  lastLoginAttempt: Date | null
  lastCheckedAt: number | null
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
    setStatus(status: AuthStatus, token?: string | null, error?: string | null): void
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
  status: 'idle' as AuthStatus,
  accessToken: null,
  tokenExpiry: null,
  expiresAt: null,
  secondsUntilExpiry: 0,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  userId: null,
  lastLoginAttempt: null,
  lastCheckedAt: null,
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

// Utility function to safely decode base64url to JSON
const b64urlDecodeToJSON = (b64url: string): any => {
  try {
    // Convert base64url to base64
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
    // Add padding if needed
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
    // Decode and parse JSON
    const jsonStr = atob(padded)
    return JSON.parse(jsonStr)
  } catch (error) {
    console.warn('Failed to decode base64url:', error)
    return null
  }
}

// Utility function to decode JWT expiry
const decodeExp = (jwt: string): number | null => {
  try {
    const [, payload] = jwt.split('.')
    if (!payload) return null
    const json = b64urlDecodeToJSON(payload)
    return typeof json?.exp === 'number' ? json.exp * 1000 : null
  } catch (error) {
    console.warn('Failed to decode JWT expiry:', error)
    return null
  }
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
          if (store.status === 'checking') {
            return
          }

          // Set status to checking
          store.actions.setStatus('checking')

          try {
            const ims = getIMSService()
            const accessToken = await ims.getAccessToken()

            // Try to validate token (non-blocking - fall back to local decode)
            let validation: IMSTokenValidation = { valid: true }
            try {
              validation = await ims.validateToken(accessToken)
            } catch (validationError) {
              console.warn('⚠️ Token validation failed (non-critical):', validationError)
              // Keep validation as valid with local fallback
            }

            if (!validation.valid) {
              store.actions.setStatus('unauthenticated', null, 'Token validation failed')
              throw new Error('Token validation failed')
            }

            // Decode token expiry from JWT
            const expMs = decodeExp(accessToken)
            const tokenExpiry = expMs ? new Date(expMs) : null
            const expiresAt = tokenExpiry
            const secondsUntilExpiry = tokenExpiry ? Math.max(0, Math.floor((tokenExpiry.getTime() - Date.now()) / 1000)) : 0

            set({
              status: 'authenticated',
              accessToken,
              tokenExpiry,
              expiresAt,
              secondsUntilExpiry,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              userId: 'ims-user', // Could be extracted from token if needed
              lastCheckedAt: Date.now(),
              refreshCount: 0
            })

            // Start auto-refresh timer
            store.actions.scheduleTokenRefresh()

            console.log('✅ IMS authentication successful')

          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
            store.actions.setStatus('error', null, errorMessage)
            console.error('❌ IMS authentication failed:', errorMessage)
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

          console.log('🔄 User logged out')
        },

        /**
         * Refresh the access token
         */
        async refreshToken(): Promise<void> {
          const store = get()

          if (store.status === 'checking') {
            return
          }

          store.actions.setStatus('checking')

          try {
            const ims = getIMSService()
            const accessToken = await ims.refreshToken()

            // Decode token expiry from JWT
            const expMs = decodeExp(accessToken)
            const tokenExpiry = expMs ? new Date(expMs) : null
            const expiresAt = tokenExpiry
            const secondsUntilExpiry = tokenExpiry ? Math.max(0, Math.floor((tokenExpiry.getTime() - Date.now()) / 1000)) : 0

            set({
              status: 'authenticated',
              accessToken,
              tokenExpiry,
              expiresAt,
              secondsUntilExpiry,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              lastCheckedAt: Date.now(),
              refreshCount: store.refreshCount + 1
            })

            // Reschedule next refresh
            store.actions.scheduleTokenRefresh()

            console.log('🔄 Token refreshed successfully')

          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Token refresh failed'
            store.actions.setStatus('error', null, errorMessage)
            console.error('❌ Token refresh failed:', errorMessage)
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
        checkAuthStatus(): boolean {
          const store = get()

          // If we're in an authenticated state, verify the token is still valid
          if (store.status === 'authenticated' && store.accessToken && store.tokenExpiry) {
            const now = new Date()
            const expiryWithBuffer = new Date(store.tokenExpiry.getTime() - 60000) // 1 minute buffer

            if (now >= expiryWithBuffer) {
              // Token expired, trigger refresh in background
              store.actions.refreshToken().catch(console.error)
              return false
            }

            return true
          }

          return false
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
        },

        /**
         * Set authentication status with optional token and error
         */
        setStatus(status: AuthStatus, token?: string | null, error?: string | null): void {
          const now = Date.now()
          const currentStore = get()
          
          // Calculate expiry fields if we have a token
          let expiresAt: Date | null = null
          let secondsUntilExpiry = 0
          
          if (token && status === 'authenticated') {
            const expMs = decodeExp(token)
            expiresAt = expMs ? new Date(expMs) : null
            secondsUntilExpiry = expiresAt ? Math.max(0, Math.floor((expiresAt.getTime() - now) / 1000)) : 0
          }
          
          set({
            status,
            accessToken: token !== undefined ? token : currentStore.accessToken,
            expiresAt,
            secondsUntilExpiry,
            isAuthenticated: status === 'authenticated',
            isLoading: status === 'checking',
            error: error !== undefined ? error : (status === 'error' ? currentStore.error : null),
            lastCheckedAt: now,
            // Clear token expiry if unauthenticated or error
            tokenExpiry: (status === 'unauthenticated' || status === 'error') ? null : currentStore.tokenExpiry
          })
        }
      }
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createUXPStorage(),
      
      // Only persist essential auth data
      partialize: (state) => ({
        status: state.status,
        accessToken: state.accessToken,
        tokenExpiry: state.tokenExpiry,
        expiresAt: state.expiresAt,
        secondsUntilExpiry: state.secondsUntilExpiry,
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        lastCheckedAt: state.lastCheckedAt,
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

// Export shared IMS service getter for use by other services
export const getSharedIMSService = (): IIMSService => {
  return getIMSService()
}

// Centralized authentication function to prevent race conditions
let _ensuring: Promise<void> | null = null

export async function ensureAuthenticated(): Promise<void> {
  if (_ensuring) return _ensuring

  _ensuring = (async () => {
    const store = useAuthStore.getState()
    if (store.status === 'authenticated') return

    // Trigger login/test flow
    await store.actions.login()

    // Wait for state to be fully set using a microtask
    await Promise.resolve()

    const finalStore = useAuthStore.getState()
    if (finalStore.status !== 'authenticated') {
      throw new Error('IMS sign-in required')
    }

    // Authentication successful - services will be created by individual components
  })().finally(() => { _ensuring = null })

  return _ensuring
}

// Toast suppression for auth errors
let lastAuthToast = 0
const AUTH_TOAST_COOLDOWN = 10000 // 10 seconds

export function showAuthRequiredOnce(message: string = 'Please sign in with your Adobe account before generating Dream Machine videos.'): void {
  const now = Date.now()
  if (now - lastAuthToast < AUTH_TOAST_COOLDOWN) return
  lastAuthToast = now

  // Import uiStore to add toast directly
  import('./uiStore').then(({ useUIStore }) => {
    const addToast = useUIStore.getState().actions.addToast
    addToast({ type: 'negative', title: 'Authentication Required', message })
  })
}

// Helper to set auth state from a token (used by IMS service)
export function setAuthFromToken(token: string): void {
  const expMs = decodeExp(token)
  const expiresAt = expMs ? new Date(expMs) : null
  const secondsUntilExpiry = expiresAt ? Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000)) : 0

  useAuthStore.getState().actions.setStatus('authenticated', token)
  
  // Also update the expiry fields directly
  useAuthStore.setState({
    expiresAt,
    secondsUntilExpiry,
    isAuthenticated: true,
    error: null
  })
}

export default useAuthStore