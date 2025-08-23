import React, { useState, useEffect } from 'react';
import { Input } from './input';
import { Check, X, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ValidatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onBlur' | 'onFocus'> {
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  errors?: string[];
  showValidation?: boolean;
  showSuccess?: boolean;
  validationDelay?: number;
  type?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  showPasswordToggle?: boolean;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  value,
  onValueChange,
  onBlur,
  onFocus,
  errors = [],
  showValidation = true,
  showSuccess = true,
  validationDelay = 300,
  type = 'text',
  placeholder,
  label,
  required,
  disabled,
  className,
  inputClassName,
  showPasswordToggle = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [displayErrors, setDisplayErrors] = useState<string[]>(errors);

  // Debounce error display
  useEffect(() => {
    if (!isFocused && errors.length > 0) {
      const timer = setTimeout(() => {
        setDisplayErrors(errors);
      }, validationDelay);
      return () => clearTimeout(timer);
    } else {
      setDisplayErrors([]);
    }
  }, [errors, isFocused, validationDelay]);

  const hasErrors = displayErrors.length > 0;
  const hasSuccess = showSuccess && value.length > 0 && !hasErrors;

  const inputType = showPasswordToggle && showPassword ? 'text' : type;

  const getBorderColor = () => {
    if (hasErrors) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    if (hasSuccess) return 'border-green-500 focus:border-green-500 focus:ring-green-500';
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  };

  const getIcon = () => {
    if (hasErrors) return <X className="h-4 w-4 text-red-500" />;
    if (hasSuccess) return <Check className="h-4 w-4 text-green-500" />;
    return null;
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <Input
          {...props}
          type={inputType}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'pr-10',
            showPasswordToggle && 'pr-20',
            getBorderColor(),
            hasErrors && 'bg-red-50',
            hasSuccess && 'bg-green-50',
            inputClassName
          )}
        />

        {/* Validation icon */}
        {showValidation && getIcon() && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {getIcon()}
          </div>
        )}

        {/* Password toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}
      </div>

      {/* Error messages */}
      {showValidation && hasErrors && displayErrors.length > 0 && (
        <div className="flex items-start space-x-1">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-600">
            {displayErrors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        </div>
      )}

      {/* Success message */}
      {showValidation && hasSuccess && !hasErrors && (
        <div className="text-sm text-green-600">
          Looks good!
        </div>
      )}
    </div>
  );
};