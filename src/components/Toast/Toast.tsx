// @ts-ignore
import React from 'react';
import { ToastVariant, Toast as ToastType } from './types';
import { CheckmarkCircleIcon, InfoIcon, AlertIcon } from '../icons';
import './Toast.scss';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
  onAction?: (id: string) => void;
}

  const getToastIcon = (variant: ToastVariant) => {
    switch (variant) {
      case 'positive':
        return <CheckmarkCircleIcon className="toast-icon" />;
      case 'negative':
        return <AlertIcon className="toast-icon" />;
      case 'info':
        return <InfoIcon className="toast-icon" />;
      case 'notice':
        return <AlertIcon className="toast-icon" />;
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
          {getToastIcon(toast.variant)}
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