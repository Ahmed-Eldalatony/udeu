import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface PasswordStrength {
  score: number;
  level: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
  color: string;
}

export interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
  showFeedback?: boolean;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
  showFeedback = true,
  className
}) => {
  const { score, level, feedback, color } = strength;

  const getLevelText = () => {
    switch (level) {
      case 'weak': return 'Weak';
      case 'fair': return 'Fair';
      case 'good': return 'Good';
      case 'strong': return 'Strong';
      default: return '';
    }
  };

  const getLevelColor = () => {
    switch (level) {
      case 'weak': return 'text-red-600';
      case 'fair': return 'text-orange-600';
      case 'good': return 'text-yellow-600';
      case 'strong': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (!strength || score === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Password strength</span>
          <span className={cn('font-medium', getLevelColor())}>
            {getLevelText()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn('h-2 rounded-full transition-all duration-300', color)}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      {showFeedback && feedback.length > 0 && (
        <div className="space-y-1">
          <p className="text-sm text-gray-600">To improve your password:</p>
          <ul className="text-sm space-y-1">
            {feedback.map((item, index) => (
              <li key={index} className="flex items-center space-x-2">
                <X className="h-3 w-3 text-red-500 flex-shrink-0" />
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Success state */}
      {level === 'strong' && (
        <div className="flex items-center space-x-2 text-sm">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-green-600">Excellent password strength!</span>
        </div>
      )}
    </div>
  );
};

export interface PasswordRequirementProps {
  password: string;
  className?: string;
}

export const PasswordRequirements: React.FC<PasswordRequirementProps> = ({
  password,
  className
}) => {
  const requirements = [
    { test: password.length >= 8, text: 'At least 8 characters' },
    { test: /[a-z]/.test(password), text: 'One lowercase letter' },
    { test: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { test: /\d/.test(password), text: 'One number' },
    { test: /[^A-Za-z0-9]/.test(password), text: 'One special character' },
  ];

  if (!password) return null;

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-sm font-medium text-gray-700">Password requirements:</p>
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center space-x-2 text-sm">
            {req.test ? (
              <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
            ) : (
              <X className="h-3 w-3 text-red-500 flex-shrink-0" />
            )}
            <span className={req.test ? 'text-green-600' : 'text-gray-600'}>
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};