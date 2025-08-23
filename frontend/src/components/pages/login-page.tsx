import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../layout/layout';
import { LoadingButton } from '../ui/loading-state';
import { ValidatedInput } from '../ui/validated-input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ErrorMessage } from '../ui/error-message';
import { useAuth } from '../../contexts/AuthContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { validationRules } from '../../lib/validation';
import type { FormValidationSchema } from '../../hooks/useFormValidation';

export const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  // Define validation schema
  const validationSchema: FormValidationSchema = {
    email: {
      rules: [validationRules.required(), validationRules.email()]
    },
    password: {
      rules: [validationRules.required('Password is required')]
    }
  };

  // Initialize form with validation
  const [formState, formActions] = useFormValidation(
    { email: '', password: '' },
    validationSchema
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    if (!formActions.validateForm()) {
      return;
    }

    const result = await login(formState.values.email, formState.values.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <Layout showNavbar={false} showFooter={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                create a new account
              </Link>
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
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

                <ValidatedInput
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formState.values.password}
                  onValueChange={(value) => formActions.setValue('password', value)}
                  onBlur={() => formActions.setTouched('password')}
                  errors={formState.errors.password}
                  label="Password"
                  placeholder="Enter your password"
                  showPasswordToggle={true}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                {error && (
                  <ErrorMessage
                    message={error}
                    onRetry={() => setError(null)}
                    variant="card"
                  />
                )}

                <div>
                  <LoadingButton
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                    loadingText="Signing in..."
                  >
                    Sign in
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