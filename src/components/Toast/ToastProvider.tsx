// @ts-ignore
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Toast as ToastComponent } from './Toast';
import { Toast, ToastContextValue } from './types';
import './Toast.scss';

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: any;
  maxToasts?: number;
  defaultDuration?: number;
}

export const ToastProvider = ({ 
  children, 
  maxToasts = 5,
  defaultDuration = 5000 
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [timers, setTimers] = useState<Map<string, NodeJS.Timeout>>(new Map());

  // Generate unique ID for toasts
  const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Clear timer for a specific toast
  const clearTimer = useCallback((id: string) => {
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      setTimers((prev: Map<string, NodeJS.Timeout>) => {
        const newTimers = new Map(prev);
        newTimers.delete(id);
        return newTimers;
      });
    }
  }, [timers]);

  // Set auto-dismiss timer for a toast
  const setTimer = useCallback((id: string, duration: number) => {
    if (duration <= 0) return;
    
    const timer = setTimeout(() => {
      hideToast(id);
    }, duration);
    
    setTimers((prev: Map<string, NodeJS.Timeout>) => new Map(prev).set(id, timer));
  }, []);

  // Show a new toast
  const showToast = useCallback((toastData: Omit<Toast, 'id' | 'createdAt'>) => {
    const id = generateId();
    const duration = toastData.duration ?? defaultDuration;
    
    const newToast: Toast = {
      ...toastData,
      id,
      createdAt: new Date(),
    };

    setToasts((prev: Toast[]) => {
      const updated = [newToast, ...prev];
      // Keep only maxToasts
      if (updated.length > maxToasts) {
        const removed = updated.slice(maxToasts);
        removed.forEach((toast: Toast) => clearTimer(toast.id));
        return updated.slice(0, maxToasts);
      }
      return updated;
    });

    // Set auto-dismiss timer if not persistent
    if (!toastData.persistent && duration > 0) {
      setTimer(id, duration);
    }

    return id;
  }, [defaultDuration, maxToasts, clearTimer, setTimer]);

  // Hide a specific toast
  const hideToast = useCallback((id: string) => {
    clearTimer(id);
    
    // Add removing class for animation
    const toastElement = document.querySelector(`[data-toast-id="${id}"]`);
    if (toastElement) {
      toastElement.classList.add('toast--removing');
      
      // Remove from state after animation
      setTimeout(() => {
        setToasts((prev: Toast[]) => prev.filter((toast: Toast) => toast.id !== id));
      }, 200); // Match animation duration
    } else {
      setToasts((prev: Toast[]) => prev.filter((toast: Toast) => toast.id !== id));
    }
  }, [clearTimer]);

  // Clear all toasts
  const clearAllToasts = useCallback(() => {
    // Clear all timers
    timers.forEach((timer: NodeJS.Timeout) => clearTimeout(timer));
    setTimers(new Map());
    
    // Add removing animation to all toasts
    const toastElements = document.querySelectorAll('.toast');
    toastElements.forEach(element => {
      element.classList.add('toast--removing');
    });
    
    // Clear state after animation
    setTimeout(() => {
      setToasts([]);
    }, 200);
  }, [timers]);

  // Convenience methods
  const showSuccess = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return showToast({
      variant: 'positive',
      title,
      message,
      ...options,
    });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return showToast({
      variant: 'negative',
      title,
      message,
      persistent: true, // Errors should be persistent by default
      ...options,
    });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return showToast({
      variant: 'info',
      title,
      message,
      ...options,
    });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return showToast({
      variant: 'notice',
      title,
      message,
      ...options,
    });
  }, [showToast]);

  // Handle toast action
  const handleToastAction = useCallback((id: string) => {
    // Action handled by the toast's callback, just hide the toast
    hideToast(id);
  }, [hideToast]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timers.forEach((timer: NodeJS.Timeout) => clearTimeout(timer));
    };
  }, [timers]);

  const contextValue: ToastContextValue = {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Container */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map((toast: Toast) => (
            <ToastComponent
              key={toast.id}
              toast={toast}
              onClose={hideToast}
              onAction={handleToastAction}
            />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

// Hook to use toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Hook for toast helpers only
export const useToastHelpers = () => {
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  return { showSuccess, showError, showInfo, showWarning };
};