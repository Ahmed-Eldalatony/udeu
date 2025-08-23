// Global Error Context for managing application-wide error states and notifications

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ApiError } from '@/hooks/useApi';
import { AppError, createErrorToast, reportError } from '@/lib/errorUtils';

interface Toast {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ErrorContextType {
  toasts: Toast[];
  addError: (error: ApiError | AppError | Error | string, context?: Record<string, any>) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  globalError: ApiError | null;
  setGlobalError: (error: ApiError | null) => void;
  clearGlobalError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
  enableReporting?: boolean;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({
  children,
  enableReporting = false
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [globalError, setGlobalError] = useState<ApiError | null>(null);

  const generateId = useCallback(() => {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = generateId();
    const toast: Toast = {
      ...toastData,
      id
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remove toast after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  }, [generateId]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const clearGlobalError = useCallback(() => {
    setGlobalError(null);
  }, []);

  const addError = useCallback((error: ApiError | AppError | Error | string, context?: Record<string, any>) => {
    // Create error toast
    const errorToast = createErrorToast(
      error instanceof AppError || error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Unknown error'),
      context
    );

    addToast(errorToast);

    // Report error if enabled
    if (enableReporting && (error instanceof Error || error instanceof AppError)) {
      reportError(error, context);
    }

    // If it's an ApiError, we can also set it as global error for more serious issues
    if (typeof error === 'object' && 'type' in error && 'retryable' in error) {
      const apiError = error as ApiError;
      // Only set as global error for non-retryable errors or auth errors
      if (!apiError.retryable || apiError.type === 'auth') {
        setGlobalError(apiError);
      }
    }
  }, [addToast, enableReporting]);

  const value: ErrorContextType = {
    toasts,
    addError,
    addToast,
    removeToast,
    clearAllToasts,
    globalError,
    setGlobalError,
    clearGlobalError,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

// Hook for easy error handling in components
export const useErrorHandler = () => {
  const { addError } = useError();

  return useCallback((error: ApiError | AppError | Error | string, context?: Record<string, any>) => {
    addError(error, context);
  }, [addError]);
};