// Error handling utilities for consistent error management across the application

export interface ErrorToast {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ErrorReport {
  id: string;
  timestamp: Date;
  error: Error;
  context?: Record<string, any>;
  userId?: string;
  url: string;
  userAgent: string;
}

// Error types and categories
export const ERROR_TYPES = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  AUTHENTICATION: 'auth',
  AUTHORIZATION: 'authz',
  SERVER: 'server',
  CLIENT: 'client',
  TIMEOUT: 'timeout',
  UNKNOWN: 'unknown'
} as const;

export type ErrorType = typeof ERROR_TYPES[keyof typeof ERROR_TYPES];

// Enhanced error class with categorization
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode?: number;
  public readonly retryable: boolean;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    type: ErrorType = ERROR_TYPES.UNKNOWN,
    statusCode?: number,
    retryable: boolean = false,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.retryable = retryable;
    this.context = context;
  }
}

// Error message mappings for user-friendly messages
export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: {
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
    actionLabel: 'Retry'
  },
  [ERROR_TYPES.TIMEOUT]: {
    title: 'Request Timeout',
    message: 'The request took too long to complete. Please try again.',
    actionLabel: 'Retry'
  },
  [ERROR_TYPES.AUTHENTICATION]: {
    title: 'Authentication Required',
    message: 'Your session has expired. Please log in to continue.',
    actionLabel: 'Log In'
  },
  [ERROR_TYPES.AUTHORIZATION]: {
    title: 'Access Denied',
    message: 'You do not have permission to perform this action.',
    actionLabel: 'Go Back'
  },
  [ERROR_TYPES.VALIDATION]: {
    title: 'Invalid Input',
    message: 'Please check your input and try again.',
    actionLabel: 'Try Again'
  },
  [ERROR_TYPES.SERVER]: {
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
    actionLabel: 'Retry'
  },
  [ERROR_TYPES.CLIENT]: {
    title: 'Application Error',
    message: 'An error occurred in the application. Please refresh the page and try again.',
    actionLabel: 'Refresh'
  },
  [ERROR_TYPES.UNKNOWN]: {
    title: 'Unexpected Error',
    message: 'An unexpected error occurred. Please try again.',
    actionLabel: 'Retry'
  }
} as const;

// Utility functions
export const createErrorToast = (
  error: AppError | Error,
  context?: Record<string, any>
): ErrorToast => {
  const appError = error instanceof AppError ? error : new AppError(error.message);
  const errorConfig = ERROR_MESSAGES[appError.type];

  return {
    id: generateErrorId(),
    title: errorConfig.title,
    message: errorConfig.message,
    type: 'error',
    duration: appError.retryable ? 8000 : 5000,
    action: appError.retryable ? {
      label: errorConfig.actionLabel,
      onClick: () => {
        // This would typically trigger a retry mechanism
        console.log('Retry action triggered', context);
      }
    } : undefined
  };
};

export const generateErrorId = (): string => {
  return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Error reporting utility (for logging to external services)
export const reportError = (
  error: Error,
  context?: Record<string, any>
): ErrorReport => {
  const errorReport: ErrorReport = {
    id: generateErrorId(),
    timestamp: new Date(),
    error,
    context,
    url: window.location.href,
    userAgent: navigator.userAgent,
    userId: getCurrentUserId() // You'd implement this based on your auth system
  };

  // In a real app, you'd send this to your error reporting service
  console.error('Error reported:', errorReport);

  // For now, just log to console. In production, you'd use a service like Sentry
  if (process.env.NODE_ENV === 'production') {
    // sendToErrorReportingService(errorReport);
  }

  return errorReport;
};

// Get current user ID from your auth context/storage
const getCurrentUserId = (): string | undefined => {
  try {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Decode JWT token to get user ID
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.userId;
    }
  } catch (error) {
    console.warn('Failed to get user ID from token:', error);
  }
  return undefined;
};

// Error boundary helper
export const createErrorInfo = (error: Error, errorInfo: any) => {
  return {
    error,
    errorInfo,
    timestamp: new Date(),
    url: window.location.href,
    userAgent: navigator.userAgent
  };
};

// Network error detection
export const isNetworkError = (error: Error): boolean => {
  return error.name === 'TypeError' &&
         (error.message.includes('fetch') || error.message.includes('Network request failed'));
};

// Timeout error detection
export const isTimeoutError = (error: Error): boolean => {
  return error.name === 'AbortError' || error.message.includes('timeout');
};

// Validation error detection
export const isValidationError = (statusCode: number): boolean => {
  return statusCode === 400 || statusCode === 422;
};

// Authentication error detection
export const isAuthError = (statusCode: number): boolean => {
  return statusCode === 401 || statusCode === 403;
};

// Retry configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  jitterFactor: 0.3
};

export const calculateRetryDelay = (retryCount: number): number => {
  const baseDelay = RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffFactor, retryCount);
  const jitter = Math.random() * RETRY_CONFIG.jitterFactor * baseDelay;
  return Math.min(baseDelay + jitter, RETRY_CONFIG.maxDelay);
};

// Error recovery strategies
export const ERROR_RECOVERY_STRATEGIES = {
  [ERROR_TYPES.NETWORK]: ['retry', 'checkConnection', 'offlineMode'],
  [ERROR_TYPES.TIMEOUT]: ['retry', 'increaseTimeout'],
  [ERROR_TYPES.AUTHENTICATION]: ['login', 'refreshToken'],
  [ERROR_TYPES.AUTHORIZATION]: ['upgradePlan', 'contactSupport'],
  [ERROR_TYPES.VALIDATION]: ['showValidationErrors', 'clearForm'],
  [ERROR_TYPES.SERVER]: ['retry', 'contactSupport'],
  [ERROR_TYPES.CLIENT]: ['refresh', 'clearCache'],
  [ERROR_TYPES.UNKNOWN]: ['retry', 'contactSupport']
} as const;

export type RecoveryStrategy = typeof ERROR_RECOVERY_STRATEGIES[keyof typeof ERROR_RECOVERY_STRATEGIES][number];

export const getRecoveryStrategies = (errorType: ErrorType): readonly RecoveryStrategy[] => {
  return ERROR_RECOVERY_STRATEGIES[errorType] || ERROR_RECOVERY_STRATEGIES[ERROR_TYPES.UNKNOWN];
};