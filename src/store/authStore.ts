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
  
  // Hydration tracking
  _hydrated: boolean
  
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
    setHydrated(hydrated: boolean): void
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
  _hydrated: false,
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
    console.log('🔐 decodeExp called with JWT:', jwt.substring(0, 50) + '...');
    const parts = jwt.split('.');
    console.log('🔐 JWT parts:', parts.length);

    if (parts.length !== 3) {
      console.warn('🔐 JWT does not have 3 parts');
      return null;
    }

    const [, payload] = parts;
    console.log('🔐 JWT payload (base64url):', payload.substring(0, 50) + '...');

    if (!payload) {
      console.warn('🔐 JWT payload is empty');
      return null;
    }

    const json = b64urlDecodeToJSON(payload);
    console.log('🔐 Decoded JWT payload:', json);

    const exp = json?.exp;
    console.log('🔐 JWT exp field:', exp, typeof exp);

    if (typeof exp === 'number') {
      const expMs = exp * 1000;
      console.log('🔐 JWT expiry timestamp (ms):', expMs, new Date(expMs).toISOString());
      return expMs;
    } else {
      console.log('🔐 JWT exp field is not a number or missing, using default expiry (1 hour from now)');
      // Default to 1 hour from now if no exp field
      const defaultExpiry = Date.now() + (60 * 60 * 1000); // 1 hour in milliseconds
      console.log('🔐 Using default expiry:', defaultExpiry, new Date(defaultExpiry).toISOString());
      return defaultExpiry;
    }
  } catch (error) {
    console.warn('🔐 Failed to decode JWT expiry:', error);
    // Return default expiry on decode error
    const defaultExpiry = Date.now() + (60 * 60 * 1000); // 1 hour in milliseconds
    console.log('🔐 Using default expiry due to decode error:', defaultExpiry, new Date(defaultExpiry).toISOString());
    return defaultExpiry;
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
          let tokenExpiry: Date | null = null
          let secondsUntilExpiry = 0
          
          if (token && status === 'authenticated') {
            const expMs = decodeExp(token)
            expiresAt = expMs ? new Date(expMs) : null
            tokenExpiry = expiresAt
            secondsUntilExpiry = expiresAt ? Math.max(0, Math.floor((expiresAt.getTime() - now) / 1000)) : 0
          }
          
          set({
            status,
            accessToken: token !== undefined ? token : currentStore.accessToken,
            expiresAt,
            tokenExpiry,
            secondsUntilExpiry,
            isAuthenticated: status === 'authenticated',
            isLoading: status === 'checking',
            error: error !== undefined ? error : (status === 'error' ? currentStore.error : null),
            lastCheckedAt: now,
            // Clear token expiry if unauthenticated or error
            // tokenExpiry: (status === 'unauthenticated' || status === 'error') ? null : currentStore.tokenExpiry
          })
        },

        /**
         * Set hydration status
         */
        setHydrated(hydrated: boolean): void {
          set({ _hydrated: hydrated })
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
        _hydrated: state._hydrated,
        userId: state.userId,
        lastCheckedAt: state.lastCheckedAt,
        refreshCount: state.refreshCount,
        // Don't persist loading states or errors
        // Don't persist service connections (they should reconnect on startup)
      }),
      
      // Handle rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Mark store as hydrated
          state.actions.setHydrated(true)
          
          // Auth store rehydrated from storage
          
          // If we have a persisted token, try to bootstrap authentication immediately
          if (state.accessToken && state.status !== 'authenticated') {
            console.log('🔄 Attempting immediate authentication bootstrap from persisted token...');
            // Try to validate and set auth state from persisted token
            try {
              const expMs = decodeExp(state.accessToken);
              const expiresAt = expMs ? new Date(expMs) : null;
              const secondsUntilExpiry = expiresAt ? Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000)) : 0;
              
              // Only auto-authenticate if token is not expired
              if (expiresAt && expiresAt > new Date()) {
                state.actions.setStatus('authenticated', state.accessToken);
                console.log('✅ Authentication bootstrapped from persisted token');
              } else {
                console.log('⚠️ Persisted token is expired, will require manual authentication');
                // Clear expired token
                state.actions.logout();
              }
            } catch (error) {
              console.warn('⚠️ Failed to bootstrap authentication from persisted token:', error);
              // Clear invalid token
              state.actions.logout();
            }
          }
          
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

// Selectors for cleaner component usage
export const selectStatus = (state: AuthStore) => state.status
export const selectToken = (state: AuthStore) => state.accessToken
export const selectIsAuthed = (state: AuthStore) => {
  const result = state.status === 'authenticated' && !!state.accessToken && !!state.tokenExpiry;
  console.log('🔍 selectIsAuthed called:', {
    status: state.status,
    hasToken: !!state.accessToken,
    hasTokenExpiry: !!state.tokenExpiry,
    result
  });
  return result;
}
export const selectHydrated = (state: AuthStore) => state._hydrated

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
    
    // Check if we're properly authenticated (status + token + expiry)
    const isFullyAuthenticated = store.status === 'authenticated' && store.accessToken && store.tokenExpiry
    
    if (isFullyAuthenticated) {
      console.log('🔐 Already fully authenticated, skipping re-auth');
      return
    }

    console.log('🔐 Not fully authenticated, starting authentication...', {
      status: store.status,
      hasToken: !!store.accessToken,
      hasTokenExpiry: !!store.tokenExpiry
    });

    // Trigger login/test flow
    await store.actions.login()

    // Wait for state to be fully set using a microtask
    await Promise.resolve()

    const finalStore = useAuthStore.getState()
    const isNowFullyAuthenticated = finalStore.status === 'authenticated' && finalStore.accessToken && finalStore.tokenExpiry
    
    if (!isNowFullyAuthenticated) {
      throw new Error('IMS sign-in required')
    }

    console.log('🔐 Authentication completed successfully');
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
  console.log('🔐 setAuthFromToken called with token:', token.substring(0, 20) + '...');
  
  const expMs = decodeExp(token)
  console.log('🔐 decodeExp returned:', expMs);
  
  const expiresAt = expMs ? new Date(expMs) : null
  const tokenExpiry = expiresAt
  const secondsUntilExpiry = expiresAt ? Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000)) : 0

  console.log('🔐 Setting auth state:', {
    status: 'authenticated',
    hasToken: !!token,
    tokenExpiry: tokenExpiry?.toISOString(),
    expiresAt: expiresAt?.toISOString(),
    secondsUntilExpiry
  });

  // Update all auth state in a single atomic operation
  useAuthStore.setState({
    status: 'authenticated',
    accessToken: token,
    tokenExpiry,
    expiresAt,
    secondsUntilExpiry,
    isAuthenticated: true,
    isLoading: false,
    error: null,
    lastCheckedAt: Date.now()
  });

  // Verify the state was set
  const newState = useAuthStore.getState();
  console.log('🔐 Auth state after update:', {
    status: newState.status,
    hasToken: !!newState.accessToken,
    hasTokenExpiry: !!newState.tokenExpiry,
    isAuthenticated: newState.isAuthenticated,
    selectIsAuthed: selectIsAuthed(newState)
  });
}

export default useAuthStore