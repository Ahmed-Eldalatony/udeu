import { useState, useCallback, useMemo } from 'react';
import type { ValidationRule, ValidationResult } from '../lib/validation';
import { validateField, validateForm, getPasswordStrength } from '../lib/validation';

export interface FieldValidation {
  rules: ValidationRule[];
  touched?: boolean;
  showErrors?: boolean;
}

export interface FormValidationSchema {
  [key: string]: FieldValidation;
}

export interface FormState {
  values: Record<string, string>;
  errors: Record<string, string[]>;
  touched: Record<string, boolean>;
  isValid: boolean;
}

export interface FormActions {
  setValue: (field: string, value: string) => void;
  setTouched: (field: string) => void;
  setFieldError: (field: string, error: string) => void;
  clearFieldError: (field: string) => void;
  validateField: (field: string) => ValidationResult;
  validateForm: () => boolean;
  resetForm: () => void;
  setValues: (values: Record<string, string>) => void;
}

export const useFormValidation = (
  initialValues: Record<string, string>,
  validationSchema: FormValidationSchema
): [FormState, FormActions] => {
  const [values, setValuesState] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});

  const setValue = useCallback((field: string, value: string) => {
    setValuesState(prev => ({ ...prev, [field]: value }));

    // Clear errors when user starts typing (unless field is touched)
    if (!touched[field]) {
      setErrors(prev => ({ ...prev, [field]: [] }));
    } else {
      // Validate field on change if touched
      const fieldValidation = validationSchema[field];
      if (fieldValidation) {
        const result = validateField(value, fieldValidation.rules);
        setErrors(prev => ({ ...prev, [field]: result.errors }));
      }
    }
  }, [touched, validationSchema]);

  const setTouched = useCallback((field: string) => {
    setTouchedState(prev => ({ ...prev, [field]: true }));

    // Validate field when touched
    const fieldValidation = validationSchema[field];
    if (fieldValidation) {
      const result = validateField(values[field] || '', fieldValidation.rules);
      setErrors(prev => ({ ...prev, [field]: result.errors }));
    }
  }, [values, validationSchema]);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: [error] }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => ({ ...prev, [field]: [] }));
  }, []);

  const validateFieldAction = useCallback((field: string): ValidationResult => {
    const fieldValidation = validationSchema[field];
    if (!fieldValidation) {
      return { isValid: true, errors: [] };
    }

    const result = validateField(values[field] || '', fieldValidation.rules);
    setErrors(prev => ({ ...prev, [field]: result.errors }));
    return result;
  }, [values, validationSchema]);

  const validateFormAction = useCallback((): boolean => {
    const formResults = validateForm(values, Object.entries(validationSchema).reduce((acc, [key, fieldValidation]) => {
      acc[key] = fieldValidation.rules;
      return acc;
    }, {} as Record<string, ValidationRule[]>));

    const newErrors: Record<string, string[]> = {};
    let allValid = true;

    Object.entries(formResults).forEach(([field, result]) => {
      newErrors[field] = result.errors;
      if (!result.isValid) {
        allValid = false;
      }
    });

    setErrors(newErrors);

    // Mark all fields as touched
    const allTouched = Object.keys(validationSchema).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouchedState(allTouched);

    return allValid;
  }, [values, validationSchema]);

  const resetForm = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
    setTouchedState({});
  }, [initialValues]);

  const setValues = useCallback((newValues: Record<string, string>) => {
    setValuesState(newValues);
  }, []);

  const isValid = useMemo(() => {
    return Object.values(errors).every(fieldErrors => fieldErrors.length === 0) &&
           Object.keys(validationSchema).every(field => {
             const fieldValidation = validationSchema[field];
             if (!fieldValidation) return true;
             return validateField(values[field] || '', fieldValidation.rules).isValid;
           });
  }, [errors, values, validationSchema]);

  const formState: FormState = {
    values,
    errors,
    touched,
    isValid
  };

  const formActions: FormActions = {
    setValue,
    setTouched,
    setFieldError,
    clearFieldError,
    validateField: validateFieldAction,
    validateForm: validateFormAction,
    resetForm,
    setValues
  };

  return [formState, formActions];
};

export const usePasswordStrength = (password: string) => {
  return useMemo(() => getPasswordStrength(password), [password]);
};