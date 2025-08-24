import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet Content */}
      {children}
    </>,
    document.body
  );
};

interface SheetContentProps {
  children: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
}

export const SheetContent: React.FC<SheetContentProps> = ({
  children,
  side = 'right',
  className
}) => {
  const sideClasses = {
    left: 'left-0 top-0 h-full w-80 transform -translate-x-full',
    right: 'right-0 top-0 h-full w-80 transform translate-x-full',
    top: 'top-0 left-0 w-full h-80 transform -translate-y-full',
    bottom: 'bottom-0 left-0 w-full h-80 transform translate-y-full'
  };

  return (
    <div
      className={cn(
        'fixed z-50 bg-white shadow-lg transition-transform duration-300 ease-in-out',
        sideClasses[side],
        // Show when open
        'translate-x-0 translate-y-0',
        className
      )}
    >
      {children}
    </div>
  );
};

interface SheetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const SheetHeader: React.FC<SheetHeaderProps> = ({ children, className }) => (
  <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
    {children}
  </div>
);

interface SheetTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SheetTitle: React.FC<SheetTitleProps> = ({ children, className }) => (
  <h2 className={cn('text-lg font-semibold text-gray-900', className)}>
    {children}
  </h2>
);

interface SheetTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const SheetTrigger: React.FC<SheetTriggerProps> = ({
  children,
  className,
  onClick
}) => {
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
};