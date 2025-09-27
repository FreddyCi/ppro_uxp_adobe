import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ToastContext, type Toast, type ToastTone } from './toast-context'

const toneTokens: Record<ToastTone, { background: string; border: string; text: string }> = {
  positive: {
    background: 'rgba(34, 197, 94, 0.18)',
    border: 'rgba(34, 197, 94, 0.42)',
    text: '#bbf7d0',
  },
  negative: {
    background: 'rgba(239, 68, 68, 0.18)',
    border: 'rgba(239, 68, 68, 0.42)',
    text: '#fecaca',
  },
  info: {
    background: 'rgba(59, 130, 246, 0.18)',
    border: 'rgba(59, 130, 246, 0.42)',
    text: '#bfdbfe',
  },
  notice: {
    background: 'rgba(249, 115, 22, 0.18)',
    border: 'rgba(249, 115, 22, 0.42)',
    text: '#fed7aa',
  },
}

interface ToastStackProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

const ToastStack = ({ toasts, onRemove }: ToastStackProps) => {
  if (toasts.length === 0) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: 12,
        pointerEvents: 'none',
        maxWidth: 360,
      }}
    >
      {toasts.map(toast => (
        <ToastCard key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

interface ToastCardProps {
  toast: Toast
  onRemove: (id: string) => void
}

const ToastCard = ({ toast, onRemove }: ToastCardProps) => {
  const [isHiding, setIsHiding] = useState(false)
  const tone = toneTokens[toast.type]

  useEffect(() => {
    if (!toast.timeout) {
      return
    }

    const timeout = window.setTimeout(() => {
      handleDismiss()
    }, toast.timeout)

    return () => window.clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id, toast.timeout])

  const handleDismiss = () => {
    setIsHiding(true)
    window.setTimeout(() => onRemove(toast.id), 180)
  }

  return (
    <div
      style={{
        pointerEvents: 'auto',
        background: tone.background,
        color: tone.text,
        border: `1px solid ${tone.border}`,
        borderRadius: 10,
        padding: '12px 14px',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.32)',
        transform: isHiding ? 'translateY(10px)' : 'translateY(0)',
        opacity: isHiding ? 0 : 1,
        transition: 'all 0.18s ease-in-out',
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: toast.message ? 4 : 0 }}>
            {toast.title}
          </div>
          {toast.message ? (
            <div style={{ fontSize: 13, lineHeight: 1.45 }}>{toast.message}</div>
          ) : null}
          {toast.actionLabel && toast.actionCallback ? (
            <button
              type='button'
              onClick={() => {
                toast.actionCallback?.()
                handleDismiss()
              }}
              style={{
                marginTop: 12,
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.24)',
                background: 'rgba(255,255,255,0.08)',
                color: tone.text,
                fontWeight: 600,
                letterSpacing: 0.2,
              }}
            >
              {toast.actionLabel}
            </button>
          ) : null}
        </div>
        <button
          type='button'
          onClick={handleDismiss}
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(255,255,255,0.12)',
            color: tone.text,
            fontSize: 16,
            fontWeight: 600,
            display: 'grid',
            placeItems: 'center',
          }}
          aria-label='Dismiss notification'
        >
          ×
        </button>
      </div>
    </div>
  )
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts(prev => [...prev, { ...toast, id, timeout: toast.timeout ?? 4500 }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => setToasts([]), [])

  const contextValue = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      clearToasts,
    }),
    [toasts, addToast, removeToast, clearToasts]
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastStack toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export default ToastProvider
