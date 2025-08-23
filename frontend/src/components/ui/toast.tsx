// Toast notification component for displaying error and other messages

import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ToastProps {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: (id: string) => void;
  className?: string;
}

const iconMap = {
  error: AlertTriangle,
  warning: AlertCircle,
  info: Info,
  success: CheckCircle,
};

const colorMap = {
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
};

const iconColorMap = {
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
  success: 'text-green-500',
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  action,
  onClose,
  className,
  duration = 5000
}) => {
  const Icon = iconMap[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm w-full',
        'animate-in slide-in-from-top-2 duration-300',
        className
      )}
    >
      <div
        className={cn(
          'rounded-lg border p-4 shadow-lg',
          colorMap[type]
        )}
      >
        <div className="flex items-start space-x-3">
          <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconColorMap[type])} />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-sm mt-1 opacity-90">{message}</p>
            {action && (
              <Button
                variant="outline"
                size="sm"
                onClick={action.onClick}
                className={cn(
                  'mt-3 text-xs h-7 px-3',
                  type === 'error' && 'border-red-300 text-red-700 hover:bg-red-100',
                  type === 'warning' && 'border-yellow-300 text-yellow-700 hover:bg-yellow-100',
                  type === 'info' && 'border-blue-300 text-blue-700 hover:bg-blue-100',
                  type === 'success' && 'border-green-300 text-green-700 hover:bg-green-100'
                )}
              >
                {action.label}
              </Button>
            )}
          </div>
          <button
            onClick={() => onClose(id)}
            className={cn(
              'flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              type === 'error' && 'focus:ring-red-500',
              type === 'warning' && 'focus:ring-yellow-500',
              type === 'info' && 'focus:ring-blue-500',
              type === 'success' && 'focus:ring-green-500'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast container component
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: 'error' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    duration?: number;
    action?: {
      label: string;
      onClick: () => void;
    };
  }>;
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            transform: `translateY(${index * 10}px)`,
            zIndex: 1000 - index
          }}
        >
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};