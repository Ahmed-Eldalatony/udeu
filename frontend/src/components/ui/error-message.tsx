import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'card';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
  size = 'md',
  variant = 'inline'
}) => {
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
          <AlertTriangle className={cn('text-red-500 mt-0.5', iconSizes[size])} />
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 mb-1">{title}</h3>
            <p className="text-red-700 mb-3">{message}</p>
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
        <AlertTriangle className={cn('text-red-500 mx-auto', iconSizes[size])} />
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600">{message}</p>
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