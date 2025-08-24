import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../layout/layout';
import { LoadingButton } from '../ui/loading-state';
import { ValidatedInput } from '../ui/validated-input';
import { PasswordStrengthIndicator } from '../ui/password-strength-indicator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useFormValidation, usePasswordStrength } from '../../hooks/useFormValidation';
import { validationRules } from '../../lib/validation';
import { useError } from '../../contexts/ErrorContext';
import type { FormValidationSchema } from '../../hooks/useFormValidation';

export const RegisterPage: React.FC = () => {
  const { addError } = useError();
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  // Define validation schema
  const validationSchema: FormValidationSchema = {
    firstName: {
      rules: [validationRules.required(), validationRules.name(), validationRules.minLength(2)]
    },
    lastName: {
      rules: [validationRules.required(), validationRules.name(), validationRules.minLength(2)]
    },
    email: {
      rules: [validationRules.required(), validationRules.email()]
    },
    password: {
      rules: [validationRules.required(), validationRules.password()]
    },
    confirmPassword: {
      rules: [validationRules.required()]
    }
  };

  // Initialize form with validation
  const [formState, formActions] = useFormValidation(
    { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
    validationSchema
  );

  // Password strength for the password field
  const passwordStrength = usePasswordStrength(formState.values.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    if (!formActions.validateForm()) {
      return;
    }

    // Additional password confirmation validation
    if (formState.values.password !== formState.values.confirmPassword) {
      formActions.setFieldError('confirmPassword', 'Passwords do not match');
      return;
    }

    const result = await register({
      email: formState.values.email,
      password: formState.values.password,
      firstName: formState.values.firstName,
      lastName: formState.values.lastName,
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      // Use the new error handling system
      addError(result.error || 'Registration failed', {
        context: 'user_registration',
        formData: {
          email: formState.values.email,
          firstName: formState.values.firstName,
          lastName: formState.values.lastName
        }
      });
    }
  };

  // Custom validation for confirm password field
  const getConfirmPasswordErrors = () => {
    const errors = [...formState.errors.confirmPassword];

    if (formState.values.confirmPassword &&
      formState.values.password !== formState.values.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return errors;
  };

  return (
    <Layout showNavbar={false} showFooter={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Join UdemyClone</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <ValidatedInput
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formState.values.firstName}
                    onValueChange={(value) => formActions.setValue('firstName', value)}
                    onBlur={() => formActions.setTouched('firstName')}
                    errors={formState.errors.firstName}
                    label="First name"
                    placeholder="Enter your first name"
                  />
                  <ValidatedInput
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formState.values.lastName}
                    onValueChange={(value) => formActions.setValue('lastName', value)}
                    onBlur={() => formActions.setTouched('lastName')}
                    errors={formState.errors.lastName}
                    label="Last name"
                    placeholder="Enter your last name"
                  />
                </div>

                <ValidatedInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formState.values.email}
                  onValueChange={(value) => formActions.setValue('email', value)}
                  onBlur={() => formActions.setTouched('email')}
                  errors={formState.errors.email}
                  label="Email address"
                  placeholder="Enter your email"
                />

                <div className="space-y-2">
                  <ValidatedInput
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formState.values.password}
                    onValueChange={(value) => formActions.setValue('password', value)}
                    onBlur={() => formActions.setTouched('password')}
                    errors={formState.errors.password}
                    label="Password"
                    placeholder="Create a password"
                    showPasswordToggle={true}
                  />
                  {formState.values.password && (
                    <PasswordStrengthIndicator
                      strength={passwordStrength}
                      className="mt-2"
                    />
                  )}
                </div>

                <ValidatedInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formState.values.confirmPassword}
                  onValueChange={(value) => formActions.setValue('confirmPassword', value)}
                  onBlur={() => formActions.setTouched('confirmPassword')}
                  errors={getConfirmPasswordErrors()}
                  label="Confirm password"
                  placeholder="Confirm your password"
                  showPasswordToggle={true}
                />


                <div>
                  <LoadingButton
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                    loadingText="Creating account..."
                  >
                    Create account
                  </LoadingButton>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};