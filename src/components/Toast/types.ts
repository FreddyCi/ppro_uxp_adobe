export type ToastVariant = 'positive' | 'negative' | 'info' | 'notice';

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
  actionLabel?: string;
  actionCallback?: () => void;
  duration?: number; // Auto-dismiss time in milliseconds (default: 5000)
  persistent?: boolean; // If true, won't auto-dismiss
  createdAt: Date;
}

export interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id' | 'createdAt'>) => string;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
  
  // Convenience methods
  showSuccess: (title: string, message?: string, options?: Partial<Toast>) => string;
  showError: (title: string, message?: string, options?: Partial<Toast>) => string;
  showInfo: (title: string, message?: string, options?: Partial<Toast>) => string;
  showWarning: (title: string, message?: string, options?: Partial<Toast>) => string;
}