export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value: string) => value.trim().length > 0,
    message
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value: string) => value.length >= min,
    message: message || `Must be at least ${min} characters long`
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value: string) => value.length <= max,
    message: message || `Must be no more than ${max} characters long`
  }),

  password: (message = 'Password must be at least 8 characters with uppercase, lowercase, and number'): ValidationRule => ({
    validate: (value: string) => {
      // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      return passwordRegex.test(value);
    },
    message
  }),

  match: (otherValue: string, message = 'Fields do not match'): ValidationRule => ({
    validate: (value: string) => value === otherValue,
    message
  }),

  name: (message = 'Name must contain only letters and spaces'): ValidationRule => ({
    validate: (value: string) => /^[a-zA-Z\s]+$/.test(value),
    message
  })
};

export const validateField = (value: string, rules: ValidationRule[]): ValidationResult => {
  const errors: string[] = [];

  for (const rule of rules) {
    if (!rule.validate(value)) {
      errors.push(rule.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateForm = (
  formData: Record<string, string>,
  validationSchema: Record<string, ValidationRule[]>
): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};

  for (const [fieldName, rules] of Object.entries(validationSchema)) {
    results[fieldName] = validateField(formData[fieldName] || '', rules);
  }

  return results;
};

export const getPasswordStrength = (password: string): {
  score: number;
  level: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
  color: string;
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Use at least 8 characters');

  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');

  if (/\d/.test(password)) score++;
  else feedback.push('Add numbers');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push('Add special characters');

  let level: 'weak' | 'fair' | 'good' | 'strong';
  let color: string;

  if (score < 2) {
    level = 'weak';
    color = 'bg-red-500';
  } else if (score < 3) {
    level = 'fair';
    color = 'bg-orange-500';
  } else if (score < 4) {
    level = 'good';
    color = 'bg-yellow-500';
  } else {
    level = 'strong';
    color = 'bg-green-500';
  }

  return { score, level, feedback, color };
};