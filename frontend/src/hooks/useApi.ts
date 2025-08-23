import { useState, useCallback } from 'react';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface ApiState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  loadingState: LoadingState;
  loadingMessage?: string;
  retryCount: number;
}

interface UseApiOptions {
  initialLoadingMessage?: string;
  successMessage?: string;
  showLoadingMessage?: boolean;
  retryOnError?: boolean;
  maxRetries?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface UseApiReturn<T> extends ApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  retry: () => Promise<void>;
  reset: () => void;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
  setLoadingMessage: (message: string) => void;
  isIdle: boolean;
  isSuccess: boolean;
  hasError: boolean;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<{ data?: T; error?: string }>,
  initialData: T | null = null,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const {
    initialLoadingMessage = 'Loading...',
    showLoadingMessage = true,
    retryOnError = false,
    maxRetries = 3,
    onSuccess,
    onError
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    error: null,
    isLoading: false,
    loadingState: 'idle',
    loadingMessage: showLoadingMessage ? initialLoadingMessage : undefined,
    retryCount: 0,
  });

  const execute = useCallback(async (...args: any[]) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      loadingState: 'loading',
      error: null,
      retryCount: prev.retryCount + 1
    }));

    try {
      const response = await apiFunction(...args);

      if (response.error) {
        const errorMessage = response.error;
        setState(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
          loadingState: 'error',
          data: null
        }));
        onError?.(errorMessage);
      } else {
        const newData = response.data || null;
        setState(prev => ({
          ...prev,
          data: newData,
          isLoading: false,
          loadingState: 'success',
          error: null,
          retryCount: 0
        }));
        onSuccess?.(newData);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        loadingState: 'error',
        data: null
      }));
      onError?.(errorMessage);
    }
  }, [apiFunction, onSuccess, onError]);

  const retry = useCallback(async () => {
    if (state.loadingState === 'error' && state.retryCount < maxRetries) {
      setState(prev => ({
        ...prev,
        error: null,
        loadingState: 'idle'
      }));
      // Note: This will need the original args to retry properly
      // For now, we reset to idle state
    }
  }, [state.loadingState, state.retryCount, maxRetries]);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      error: null,
      isLoading: false,
      loadingState: 'idle',
      loadingMessage: showLoadingMessage ? initialLoadingMessage : undefined,
      retryCount: 0,
    });
  }, [initialData, initialLoadingMessage, showLoadingMessage]);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
      loadingState: error ? 'error' : prev.loadingState
    }));
  }, []);

  const setLoadingMessage = useCallback((message: string) => {
    setState(prev => ({ ...prev, loadingMessage: message }));
  }, []);

  return {
    ...state,
    execute,
    retry,
    reset,
    setData,
    setError,
    setLoadingMessage,
    isIdle: state.loadingState === 'idle',
    isSuccess: state.loadingState === 'success',
    hasError: state.loadingState === 'error',
  };
}