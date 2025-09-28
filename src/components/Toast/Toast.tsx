// @ts-ignore
import React from 'react';
import { Toast as ToastType } from './types';
import './Toast.scss';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
  onAction?: (id: string) => void;
}

const getToastIcon = (variant: ToastType['variant']) => {
  switch (variant) {
    case 'positive':
      return '✓'; // Checkmark
    case 'negative':
      return '✗'; // X mark
    case 'info':
      return 'ℹ'; // Info
    case 'notice':
      return '⚠'; // Warning triangle
    default:
      return 'ℹ';
  }
};

const getToastIconName = (variant: ToastType['variant']) => {
  switch (variant) {
    case 'positive':
      return 'ui:CheckmarkMedium';
    case 'negative':
      return 'ui:CrossMedium';
    case 'info':
      return 'ui:InfoMedium';
    case 'notice':
      return 'ui:AlertMedium';
    default:
      return 'ui:InfoMedium';
  }
};

export const Toast = ({ toast, onClose, onAction }: ToastProps) => {
  const handleAction = () => {
    if (toast.actionCallback) {
      toast.actionCallback();
    }
    if (onAction) {
      onAction(toast.id);
    }
  };

  const handleClose = () => {
    onClose(toast.id);
  };

  return (
    <div className={`toast toast--${toast.variant}`} data-toast-id={toast.id}>
      <div className="toast__content">
        {/* Icon */}
        <div className="toast__icon">
          {/* @ts-ignore */}
          <sp-icon name={getToastIconName(toast.variant)} size="s"></sp-icon>
        </div>
        
        {/* Text Content */}
        <div className="toast__text">
          <div className="toast__title">{toast.title}</div>
          {toast.message && (
            <div className="toast__message">{toast.message}</div>
          )}
        </div>
        
        {/* Action Button */}
        {toast.actionLabel && (
          <div className="toast__action">
            {/* @ts-ignore */}
            <sp-button 
              size="s" 
              variant="secondary"
              onClick={handleAction}
              className="toast__action-button"
            >
              {toast.actionLabel}
            {/* @ts-ignore */}
            </sp-button>
          </div>
        )}
        
        {/* Close Button */}
        <div className="toast__close">
          {/* @ts-ignore */}
          <sp-action-button 
            size="s" 
            quiet 
            onClick={handleClose}
            className="toast__close-button"
            title="Close notification"
          >
            {/* @ts-ignore */}
            <sp-icon name="ui:CrossSmall" size="s"></sp-icon>
          {/* @ts-ignore */}
          </sp-action-button>
        </div>
      </div>
    </div>
  );
};