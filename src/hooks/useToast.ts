/**
 * Toast hooks and utilities - Store-based implementation
 * Uses Zustand UIStore for toast management instead of React Context
 */

import { useUIToasts, useToastHelpers as useStoreToastHelpers } from '../store/uiStore'

// Main toast hook using store
export const useToast = () => {
  const { toasts, addToast, removeToast, clearToasts, updateToast } = useUIToasts()
  
  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    updateToast
  }
}

// Convenience hooks for common toast types - delegates to store implementation
export const useToastHelpers = () => {
  return useStoreToastHelpers()
}