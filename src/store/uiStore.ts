/**
 * UI Store for User Interface State Management
 * Handles loading states, toasts, navigation, and user preferences
 * Uses Zustand for state management with UXP-compatible local storage persistence
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

// Toast types to match existing toast system
export interface Toast {
  id: string
  type: 'positive' | 'negative' | 'info' | 'notice'
  title: string
  message?: string
  timeout?: number
  timestamp: Date
  actionLabel?: string
  actionCallback?: () => void
}

// User preferences interface
export interface UserPreferences {
  autoSave: boolean
  defaultPrompt: string
  defaultStyle: string
  defaultAspectRatio: string
  maxHistoryItems: number
  enableNotifications: boolean
  enableTelemetry: boolean
  exportQuality: 'low' | 'medium' | 'high'
  videoFormat: 'mp4' | 'mov'
  debugMode: boolean
}

// Store interface for UI state management
export interface UIStore {
  // Loading states
  isLoading: boolean
  loadingMessage: string
  loadingProgress: number
  
  // Toast notifications
  toasts: Toast[]
  
  // Navigation and layout
  activeTab: 'generate' | 'gallery' | 'video' | 'export' | 'settings'
  panelSize: { width: number; height: number }
  sidebarCollapsed: boolean
  
  // Modals and dialogs
  activeModal: string | null
  modalData: Record<string, unknown>
  
  // Theme and preferences
  theme: 'light' | 'dark' | 'auto'
  preferences: UserPreferences
  
  // Error states
  globalError: string | null
  lastError: Date | null
  
  // Actions
  actions: {
    // Loading management
    setLoading: (loading: boolean, message?: string, progress?: number) => void
    setLoadingProgress: (progress: number) => void
    clearLoading: () => void
    
    // Toast management
    addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => void
    removeToast: (id: string) => void
    clearToasts: () => void
    updateToast: (id: string, updates: Partial<Toast>) => void
    
    // Navigation and layout
    setActiveTab: (tab: 'generate' | 'gallery' | 'video' | 'export' | 'settings') => void
    setPanelSize: (size: { width: number; height: number }) => void
    setSidebarCollapsed: (collapsed: boolean) => void
    
    // Modal management
    showModal: (modalId: string, data?: Record<string, unknown>) => void
    hideModal: () => void
    updateModalData: (data: Record<string, unknown>) => void
    
    // Theme and preferences
    setTheme: (theme: 'light' | 'dark' | 'auto') => void
    updatePreferences: (preferences: Partial<UserPreferences>) => void
    resetPreferences: () => void
    
    // Error management
    setGlobalError: (error: string | null) => void
    clearGlobalError: () => void
  }
}

// UXP-compatible storage implementation
const createUXPStorage = () => {
  return createJSONStorage(() => ({
    getItem: (key: string) => {
      try {
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

// Default user preferences
const defaultPreferences: UserPreferences = {
  autoSave: true,
  defaultPrompt: '',
  defaultStyle: 'natural',
  defaultAspectRatio: '16:9',
  maxHistoryItems: 100,
  enableNotifications: true,
  enableTelemetry: false,
  exportQuality: 'high',
  videoFormat: 'mp4',
  debugMode: false
}

// Initial state
const initialState = {
  isLoading: false,
  loadingMessage: '',
  loadingProgress: 0,
  toasts: [],
  activeTab: 'generate' as const,
  panelSize: { width: 320, height: 600 },
  sidebarCollapsed: false,
  activeModal: null,
  modalData: {},
  theme: 'dark' as const, // Default to dark for Premiere Pro
  preferences: defaultPreferences,
  globalError: null,
  lastError: null
}

// Create the UI store
export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      actions: {
        // Loading management
        setLoading(loading: boolean, message = '', progress = 0): void {
          set({
            isLoading: loading,
            loadingMessage: message,
            loadingProgress: Math.max(0, Math.min(100, progress))
          })
        },

        setLoadingProgress(progress: number): void {
          set({
            loadingProgress: Math.max(0, Math.min(100, progress))
          })
        },

        clearLoading(): void {
          set({
            isLoading: false,
            loadingMessage: '',
            loadingProgress: 0
          })
        },

        // Toast management
        addToast(toastData: Omit<Toast, 'id' | 'timestamp'>): void {
          const toast: Toast = {
            ...toastData,
            id: uuidv4(),
            timestamp: new Date(),
            timeout: toastData.timeout || 5000 // Default 5 seconds
          }

          set((state) => ({
            toasts: [toast, ...state.toasts]
          }))

          // Auto-remove toast after timeout
          if (toast.timeout && toast.timeout > 0) {
            setTimeout(() => {
              get().actions.removeToast(toast.id)
            }, toast.timeout)
          }
        },

        removeToast(id: string): void {
          set((state) => ({
            toasts: state.toasts.filter(toast => toast.id !== id)
          }))
        },

        clearToasts(): void {
          set({ toasts: [] })
        },

        updateToast(id: string, updates: Partial<Toast>): void {
          set((state) => ({
            toasts: state.toasts.map(toast =>
              toast.id === id ? { ...toast, ...updates } : toast
            )
          }))
        },

        // Navigation and layout
        setActiveTab(tab: 'generate' | 'gallery' | 'video' | 'export' | 'settings'): void {
          set({ activeTab: tab })
        },

        setPanelSize(size: { width: number; height: number }): void {
          set({ panelSize: size })
        },

        setSidebarCollapsed(collapsed: boolean): void {
          set({ sidebarCollapsed: collapsed })
        },

        // Modal management
        showModal(modalId: string, data = {}): void {
          set({
            activeModal: modalId,
            modalData: data
          })
        },

        hideModal(): void {
          set({
            activeModal: null,
            modalData: {}
          })
        },

        updateModalData(data: Record<string, unknown>): void {
          set((state) => ({
            modalData: { ...state.modalData, ...data }
          }))
        },

        // Theme and preferences
        setTheme(theme: 'light' | 'dark' | 'auto'): void {
          set({ theme })
        },

        updatePreferences(preferences: Partial<UserPreferences>): void {
          set((state) => ({
            preferences: { ...state.preferences, ...preferences }
          }))
        },

        resetPreferences(): void {
          set({ preferences: defaultPreferences })
        },

        // Error management
        setGlobalError(error: string | null): void {
          set({ 
            globalError: error, 
            lastError: error ? new Date() : null 
          })
        },

        clearGlobalError(): void {
          set({ globalError: null })
        }
      }
    }),
    {
      name: 'ui-storage', // localStorage key
      storage: createUXPStorage(),
      
      // Only persist essential UI settings
      partialize: (state) => ({
        activeTab: state.activeTab,
        panelSize: state.panelSize,
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        preferences: state.preferences,
        // Don't persist loading states, toasts, modals, or errors
      }),
      
      // Handle rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Reset transient state on rehydration
          state.isLoading = false
          state.loadingMessage = ''
          state.loadingProgress = 0
          state.toasts = []
          state.activeModal = null
          state.modalData = {}
          state.globalError = null
          state.lastError = null
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
export const useUILoading = () => {
  return useUIStore((state) => ({
    isLoading: state.isLoading,
    loadingMessage: state.loadingMessage,
    loadingProgress: state.loadingProgress,
    setLoading: state.actions.setLoading,
    setLoadingProgress: state.actions.setLoadingProgress,
    clearLoading: state.actions.clearLoading
  }))
}

/**
 * Check if Azure SAS upload is configured
 * Separate from IMS authentication - this checks environment variables only
 */
export const selectHasSAS = () => {
  const containerSasUrl = import.meta.env.VITE_AZURE_CONTAINER_SAS_URL

  if (containerSasUrl) {
    return true
  }

  const accountName = import.meta.env.VITE_AZURE_ACCOUNT_NAME
  const containerName = import.meta.env.VITE_AZURE_CONTAINER_NAME
  const sasToken = import.meta.env.VITE_AZURE_SAS_TOKEN

  return !!(accountName && containerName && sasToken)
}

/**
 * Get detailed SAS configuration status
 */
export const selectSASStatus = (): {
  configured: boolean
  method: 'container-url' | 'parts' | 'none'
  message: string
} => {
  const containerSasUrl = import.meta.env.VITE_AZURE_CONTAINER_SAS_URL

  if (containerSasUrl) {
    return {
      configured: true,
      method: 'container-url',
      message: 'Azure SAS configured via VITE_AZURE_CONTAINER_SAS_URL',
    }
  }

  const accountName = import.meta.env.VITE_AZURE_ACCOUNT_NAME
  const containerName = import.meta.env.VITE_AZURE_CONTAINER_NAME
  const sasToken = import.meta.env.VITE_AZURE_SAS_TOKEN

  if (accountName && containerName && sasToken) {
    return {
      configured: true,
      method: 'parts',
      message: 'Azure SAS configured via parts (account + container + token)',
    }
  }

  return {
    configured: false,
    method: 'none',
    message:
      'Azure SAS not configured. Set VITE_AZURE_CONTAINER_SAS_URL or ' +
      '(VITE_AZURE_ACCOUNT_NAME + VITE_AZURE_CONTAINER_NAME + VITE_AZURE_SAS_TOKEN) in .env',
  }
}

export const useUIToasts = () => {
  return useUIStore((state) => ({
    toasts: state.toasts,
    addToast: state.actions.addToast,
    removeToast: state.actions.removeToast,
    clearToasts: state.actions.clearToasts,
    updateToast: state.actions.updateToast
  }))
}

export const useUINavigation = () => {
  return useUIStore((state) => ({
    activeTab: state.activeTab,
    setActiveTab: state.actions.setActiveTab
  }))
}

export const useUILayout = () => {
  return useUIStore((state) => ({
    panelSize: state.panelSize,
    sidebarCollapsed: state.sidebarCollapsed,
    setPanelSize: state.actions.setPanelSize,
    setSidebarCollapsed: state.actions.setSidebarCollapsed
  }))
}

export const useUIModal = () => {
  return useUIStore((state) => ({
    activeModal: state.activeModal,
    modalData: state.modalData,
    showModal: state.actions.showModal,
    hideModal: state.actions.hideModal,
    updateModalData: state.actions.updateModalData
  }))
}

export const useUITheme = () => {
  return useUIStore((state) => ({
    theme: state.theme,
    setTheme: state.actions.setTheme
  }))
}

export const useUIPreferences = () => {
  return useUIStore((state) => ({
    preferences: state.preferences,
    updatePreferences: state.actions.updatePreferences,
    resetPreferences: state.actions.resetPreferences
  }))
}

export const useUIError = () => {
  return useUIStore((state) => ({
    globalError: state.globalError,
    lastError: state.lastError,
    setGlobalError: state.actions.setGlobalError,
    clearGlobalError: state.actions.clearGlobalError
  }))
}

export const useUIActions = () => {
  return useUIStore((state) => state.actions)
}

// Helper hook for showing different types of toasts
export const useToastHelpers = () => {
  const addToast = useUIStore((state) => state.actions.addToast)

  return {
    showSuccess: (title: string, message?: string) => 
      addToast({ type: 'positive', title, message }),
    
    showError: (title: string, message?: string) => 
      addToast({ type: 'negative', title, message }),
    
    showInfo: (title: string, message?: string) => 
      addToast({ type: 'info', title, message }),
    
    showWarning: (title: string, message?: string) => 
      addToast({ type: 'notice', title, message }),
    
    showWithAction: (
      type: Toast['type'], 
      title: string, 
      message: string, 
      actionLabel: string, 
      actionCallback: () => void
    ) => addToast({ type, title, message, actionLabel, actionCallback })
  }
}

export default useUIStore