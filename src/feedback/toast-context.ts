import { createContext, useContext } from 'react'
import type { Toast as UIStoreToast } from '../store/uiStore'

// Type aliases for compatibility
export type ToastTone = 'positive' | 'negative' | 'info' | 'notice'

// Re-export Toast type from store
export type Toast = UIStoreToast

// Context value interface
export interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const useToastContext = (): ToastContextValue => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}
