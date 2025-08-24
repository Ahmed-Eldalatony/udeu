import { useState, useCallback, useRef } from 'react';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type ErrorType = 'network' | 'server' | 'validation' | 'auth' | 'timeout' | 'unknown';

export interface ApiError {
  type: ErrorType;
  message: string;
  details?: string;
  statusCode?: number;
  retryable: boolean;
}

interface ApiState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  loadingState: LoadingState;
  loadingMessage?: string;
  retryCount: number;
  lastArgs?: any[];
}

interface UseApiOptions {
  initialLoadingMessage?: string;
  successMessage?: string;
  showLoadingMessage?: boolean;
  retryOnError?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
  onRetry?: (retryCount: number) => void;
}

interface UseApiReturn<T> extends ApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  retry: () => Promise<void>;
  reset: () => void;
  setData: (data: T | null) => void;
  setError: (error: ApiError | null) => void;
  setLoadingMessage: (message: string) => void;
  isIdle: boolean;
  isSuccess: boolean;
  hasError: boolean;
  canRetry: boolean;
}

// Helper function to categorize errors
const categorizeError = (error: unknown, statusCode?: number): ApiError => {
  if (error instanceof Error) {
    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        type: 'network',
        message: 'Unable to connect to the server. Please check your internet connection.',
        details: error.message,
        retryable: true
      };
    }

    // Timeout errors
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return {
        type: 'timeout',
        message: 'Request timed out. Please try again.',
        details: error.message,
        retryable: true
      };
    }
  }

  // HTTP status code based errors
  if (statusCode) {
    switch (statusCode) {
      case 400:
        return {
          type: 'validation',
          message: 'Invalid request. Please check your input and try again.',
          statusCode,
          retryable: false
        };
      case 401:
        return {
          type: 'auth',
          message: 'Your session has expired. Please log in again.',
          statusCode,
          retryable: false
        };
      case 403:
        return {
          type: 'auth',
          message: 'You do not have permission to perform this action.',
          statusCode,
          retryable: false
        };
      case 404:
        return {
          type: 'server',
          message: 'The requested resource was not found.',
          statusCode,
          retryable: false
        };
      case 429:
        return {
          type: 'server',
          message: 'Too many requests. Please wait a moment and try again.',
          statusCode,
          retryable: true
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: 'server',
          message: 'Server is temporarily unavailable. Please try again later.',
          statusCode,
          retryable: true
        };
      default:
        return {
          type: 'server',
          message: `Server error (${statusCode}). Please try again.`,
          statusCode,
          retryable: statusCode >= 500
        };
    }
  }

  // Default error
  return {
    type: 'unknown',
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    details: error instanceof Error ? error.message : String(error),
    retryable: true
  };
};

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<{ data?: T; error?: string; statusCode?: number }>,
  initialData: T | null = null,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const {
    initialLoadingMessage = 'Loading...',
    showLoadingMessage = true,
    // retryOnError = false,
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 30000,
    onSuccess,
    onError,
    onRetry
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    error: null,
    isLoading: false,
    loadingState: 'idle',
    loadingMessage: showLoadingMessage ? initialLoadingMessage : undefined,
    retryCount: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      isLoading: true,
      loadingState: 'loading',
      error: null,
      retryCount: prev.retryCount + 1,
      lastArgs: args
    }));

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout);
      });

      // Race the API call against timeout
      const response = await Promise.race([
        apiFunction(...args),
        timeoutPromise
      ]);

      if (abortControllerRef.current.signal.aborted) {
        return; // Request was cancelled
      }

      if (response.error) {
        const apiError = categorizeError(new Error(response.error), response.statusCode);
        setState(prev => ({
          ...prev,
          error: apiError,
          isLoading: false,
          loadingState: 'error',
          data: null
        }));
        onError?.(apiError);
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
      if (abortControllerRef.current.signal.aborted) {
        return; // Request was cancelled
      }

      const apiError = categorizeError(error);
      setState(prev => ({
        ...prev,
        error: apiError,
        isLoading: false,
        loadingState: 'error',
        data: null
      }));
      onError?.(apiError);
    }
  }, [apiFunction, onSuccess, onError, timeout]);

  const retry = useCallback(async () => {
    if (state.error?.retryable && state.retryCount < maxRetries && state.lastArgs) {
      const retryCount = state.retryCount + 1;
      onRetry?.(retryCount);

      // Exponential backoff with jitter
      const baseDelay = retryDelay * Math.pow(2, retryCount - 1);
      const jitter = Math.random() * 0.3 * baseDelay;
      const delay = Math.min(baseDelay + jitter, 10000); // Cap at 10 seconds

      setState(prev => ({
        ...prev,
        error: null,
        loadingState: 'idle',
        retryCount
      }));

      await new Promise(resolve => setTimeout(resolve, delay));
      await execute(...state.lastArgs);
    }
  }, [state.error, state.retryCount, state.lastArgs, maxRetries, retryDelay, onRetry, execute]);

  const reset = useCallback(() => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setState({
      data: initialData,
      error: null,
      isLoading: false,
      loadingState: 'idle',
      loadingMessage: showLoadingMessage ? initialLoadingMessage : undefined,
      retryCount: 0,
      lastArgs: undefined,
    });
  }, [initialData, initialLoadingMessage, showLoadingMessage]);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: ApiError | null) => {
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
    canRetry: Boolean(state.error?.retryable && state.retryCount < maxRetries),
  };
}