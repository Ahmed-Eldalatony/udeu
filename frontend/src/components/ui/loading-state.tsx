import React from 'react';
import { LoadingSpinner } from './loading-spinner';
import { ErrorMessage } from './error-message';
import { Progress } from './progress';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  isLoading?: boolean;
  loadingState?: 'idle' | 'loading' | 'success' | 'error';
  loadingMessage?: string;
  error?: string | null;
  onRetry?: () => void;
  progress?: number;
  children?: React.ReactNode;
  className?: string;
  variant?: 'inline' | 'overlay' | 'card' | 'fullscreen';
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  showError?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading = false,
  loadingState = 'idle',
  loadingMessage = 'Loading...',
  error = null,
  onRetry,
  progress,
  children,
  className,
  variant = 'inline',
  size = 'md',
  showProgress = false,
  showError = true,
}) => {
  // Determine if we should show loading
  const shouldShowLoading = isLoading || loadingState === 'loading';

  // Determine if we should show error
  const shouldShowError = showError && (error || loadingState === 'error');

  // If not loading and no error, just render children
  if (!shouldShowLoading && !shouldShowError) {
    return <>{children}</>;
  }

  const renderContent = () => {
    if (shouldShowError && error) {
      return (
        <ErrorMessage
          message={error}
          onRetry={onRetry}
          variant="card"
          size={size}
        />
      );
    }

    if (shouldShowLoading) {
      return (
        <div className={cn(
          'flex flex-col items-center justify-center space-y-4',
          {
            'p-4': variant === 'card',
            'fixed inset-0 bg-white bg-opacity-80 z-50': variant === 'fullscreen',
            'absolute inset-0 bg-white bg-opacity-80 z-10': variant === 'overlay',
          },
          className
        )}>
          <LoadingSpinner size={size} text={loadingMessage} />
          {showProgress && progress !== undefined && (
            <div className="w-full max-w-xs">
              <Progress value={progress} size={size} />
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  if (variant === 'inline') {
    return (
      <div className={cn('relative', className)}>
        {renderContent()}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn(
        'relative bg-white rounded-lg border border-gray-200 shadow-sm',
        className
      )}>
        {shouldShowLoading || shouldShowError ? renderContent() : children}
      </div>
    );
  }

  if (variant === 'overlay' || variant === 'fullscreen') {
    return (
      <div className={cn('relative', className)}>
        {children}
        {(shouldShowLoading || shouldShowError) && renderContent()}
      </div>
    );
  }

  return <>{children}</>;
};

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  loadingState?: 'idle' | 'loading' | 'success' | 'error';
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText = 'Loading...',
  loadingState = 'idle',
  children,
  disabled,
  className,
  ...props
}) => {
  const isInLoadingState = isLoading || loadingState === 'loading';

  return (
    <button
      {...props}
      disabled={disabled || isInLoadingState}
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-200',
        {
          'bg-blue-600 text-white hover:bg-blue-700': !isInLoadingState,
          'bg-blue-400 text-white cursor-not-allowed': isInLoadingState,
        },
        className
      )}
    >
      {isInLoadingState ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

interface LoadingCardProps {
  isLoading?: boolean;
  loadingState?: 'idle' | 'loading' | 'success' | 'error';
  loadingMessage?: string;
  error?: string | null;
  onRetry?: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  isLoading = false,
  loadingState = 'idle',
  loadingMessage = 'Loading...',
  error = null,
  onRetry,
  title,
  children,
  className,
}) => {
  return (
    <div className={cn(
      'bg-white rounded-lg border border-gray-200 shadow-sm p-6',
      className
    )}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}

      <LoadingState
        isLoading={isLoading}
        loadingState={loadingState}
        loadingMessage={loadingMessage}
        error={error}
        onRetry={onRetry}
        variant="inline"
      >
        {children}
      </LoadingState>
    </div>
  );
};