import React from 'react';
import { AlertTriangle, RefreshCw, Wifi, Clock, Shield, Server, Bug } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import type { ApiError } from '@/hooks/useApi';
import { ERROR_MESSAGES, AppError } from '@/lib/errorUtils';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  error?: ApiError | AppError | Error | string | null;
  onRetry?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'card';
  showErrorType?: boolean;
  showRetryCount?: boolean;
  retryCount?: number;
}

const getErrorIcon = (errorType?: string) => {
  switch (errorType) {
    case 'network':
      return Wifi;
    case 'timeout':
      return Clock;
    case 'auth':
      return Shield;
    case 'server':
      return Server;
    default:
      return AlertTriangle;
  }
};

const getErrorDetails = (error?: ApiError | AppError | Error | string | null) => {
  if (!error) {
    return { title: 'Something went wrong', message: 'An unexpected error occurred', type: undefined };
  }

  if (typeof error === 'string') {
    return { title: 'Error', message: error, type: undefined };
  }

  if (error instanceof Error && 'type' in error) {
    const apiError = error as ApiError;
    const config = ERROR_MESSAGES[apiError.type as keyof typeof ERROR_MESSAGES];
    return {
      title: config?.title || 'Error',
      message: apiError.message || config?.message || 'An error occurred',
      type: apiError.type,
      details: apiError.details,
      statusCode: apiError.statusCode
    };
  }

  return {
    title: 'Error',
    message: error.message || 'An unexpected error occurred',
    type: undefined
  };
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  error,
  onRetry,
  className,
  size = 'md',
  variant = 'inline',
  showErrorType = false,
  showRetryCount = false,
  retryCount
}) => {
  const errorDetails = getErrorDetails(error);
  const displayTitle = title || errorDetails.title;
  const displayMessage = message || errorDetails.message;
  const ErrorIcon = getErrorIcon(errorDetails.type);

  const sizeClasses = {
    sm: 'text-sm p-3',
    md: 'text-base p-4',
    lg: 'text-lg p-6'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (variant === 'card') {
    return (
      <div className={cn(
        'bg-red-50 border border-red-200 rounded-lg',
        sizeClasses[size],
        className
      )}>
        <div className="flex items-start space-x-3">
          <ErrorIcon className={cn('text-red-500 mt-0.5', iconSizes[size])} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-red-800">{displayTitle}</h3>
              {showErrorType && errorDetails.type && (
                <span className="text-xs bg-red-200 text-red-700 px-2 py-1 rounded-full">
                  {errorDetails.type}
                </span>
              )}
            </div>
            <p className="text-red-700 mb-2">{displayMessage}</p>
            {errorDetails.details && (
              <p className="text-red-600 text-sm mb-2">{errorDetails.details}</p>
            )}
            {showRetryCount && retryCount && (
              <p className="text-red-600 text-sm mb-2">
                Retry attempt {retryCount}
              </p>
            )}
            {errorDetails.statusCode && (
              <p className="text-red-600 text-sm mb-2">
                Status: {errorDetails.statusCode}
              </p>
            )}
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center justify-center py-8',
      className
    )}>
      <div className="text-center space-y-3">
        <ErrorIcon className={cn('text-red-500 mx-auto', iconSizes[size])} />
        <div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{displayTitle}</h3>
            {showErrorType && errorDetails.type && (
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {errorDetails.type}
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-2">{displayMessage}</p>
          {errorDetails.details && (
            <p className="text-gray-500 text-sm mb-2">{errorDetails.details}</p>
          )}
          {showRetryCount && retryCount && (
            <p className="text-gray-500 text-sm mb-2">
              Retry attempt {retryCount}
            </p>
          )}
        </div>
        {onRetry && (
          <Button
            variant="outline"
            onClick={onRetry}
            className="border-gray-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};