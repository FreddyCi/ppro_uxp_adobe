/**
 * Toast types and utilities - Store-based implementation
 * Re-exports from uiStore to maintain API compatibility
 */

import { useUIToasts, type Toast as UIStoreToast } from '../store/uiStore'

// Type aliases for compatibility
export type ToastTone = 'positive' | 'negative' | 'info' | 'notice'

// Re-export Toast type from store
export type Toast = UIStoreToast

// Context value interface for compatibility (implemented via store)
export interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

// Store-based context implementation (no React Context needed)
export const useToastContext = (): ToastContextValue => {
  return useUIToasts()
}

// For backward compatibility, export as ToastContext (function instead of React Context)
export const ToastContext = useToastContext
