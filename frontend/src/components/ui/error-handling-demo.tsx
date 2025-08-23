// Demo component to test error handling and retry mechanisms

import React, { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { ErrorMessage } from './error-message';
import { useError } from '../../contexts/ErrorContext';
import { useApi } from '../../hooks/useApi';
import { AppError } from '../../lib/errorUtils';

// Mock API functions that simulate different error scenarios
const mockApiCall = async (scenario: string): Promise<{ data?: any; error?: string; statusCode?: number }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  switch (scenario) {
    case 'success':
      return { data: { message: 'Success!', timestamp: new Date().toISOString() } };

    case 'network-error':
      throw new Error('Network request failed');

    case 'timeout':
      // Simulate timeout by taking too long
      await new Promise(resolve => setTimeout(resolve, 35000));
      return { data: { message: 'This should not be reached' } };

    case 'server-error':
      return {
        error: 'Internal server error occurred',
        statusCode: 500
      };

    case 'validation-error':
      return {
        error: 'Invalid input provided',
        statusCode: 400
      };

    case 'auth-error':
      return {
        error: 'Authentication required',
        statusCode: 401
      };

    case 'rate-limit':
      return {
        error: 'Too many requests',
        statusCode: 429
      };

    default:
      return { data: { message: 'Unknown scenario' } };
  }
};

export const ErrorHandlingDemo: React.FC = () => {
  const { addError, addToast } = useError();
  const [selectedScenario, setSelectedScenario] = useState<string>('success');

  // Test the enhanced useApi hook
  const {
    execute,
    data,
    error,
    isLoading,
    loadingState,
    canRetry,
    retry,
    retryCount
  } = useApi(
    mockApiCall,
    null,
    {
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 2000,
      timeout: 30000,
      onSuccess: (data) => {
        console.log('API call succeeded:', data);
      },
      onError: (error) => {
        console.log('API call failed:', error);
      },
      onRetry: (retryCount) => {
        console.log(`Retrying API call (attempt ${retryCount})`);
      }
    }
  );

  const handleApiCall = async () => {
    await execute(selectedScenario);
  };

  const handleManualError = () => {
    // Test different error scenarios
    switch (selectedScenario) {
      case 'app-error':
        const appError = new AppError('This is a custom application error', 'client', undefined, true, {
          component: 'ErrorHandlingDemo',
          action: 'manual_error_test'
        });
        addError(appError);
        break;

      case 'toast-success':
        addToast({
          type: 'success',
          title: 'Success!',
          message: 'This is a success toast message',
          duration: 3000
        });
        break;

      case 'toast-warning':
        addToast({
          type: 'warning',
          title: 'Warning',
          message: 'This is a warning toast message',
          duration: 4000
        });
        break;

      case 'toast-info':
        addToast({
          type: 'info',
          title: 'Information',
          message: 'This is an info toast message',
          duration: 5000,
          action: {
            label: 'Learn More',
            onClick: () => console.log('Learn more clicked')
          }
        });
        break;

      default:
        addError('This is a manual error test', { scenario: selectedScenario });
    }
  };

  const scenarios = [
    { value: 'success', label: 'Success Response', description: 'Normal successful API call' },
    { value: 'network-error', label: 'Network Error', description: 'Simulates network connectivity issues' },
    { value: 'timeout', label: 'Timeout Error', description: 'Simulates request timeout' },
    { value: 'server-error', label: 'Server Error (500)', description: 'Simulates server internal error' },
    { value: 'validation-error', label: 'Validation Error (400)', description: 'Simulates client validation error' },
    { value: 'auth-error', label: 'Auth Error (401)', description: 'Simulates authentication error' },
    { value: 'rate-limit', label: 'Rate Limit (429)', description: 'Simulates rate limiting' },
    { value: 'app-error', label: 'Custom App Error', description: 'Creates a custom application error' },
    { value: 'toast-success', label: 'Success Toast', description: 'Shows success toast notification' },
    { value: 'toast-warning', label: 'Warning Toast', description: 'Shows warning toast notification' },
    { value: 'toast-info', label: 'Info Toast with Action', description: 'Shows info toast with action button' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Error Handling & Retry Mechanism Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scenario Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Select Test Scenario</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {scenarios.map((scenario) => (
                <div key={scenario.value} className="border rounded-lg p-3">
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="scenario"
                      value={scenario.value}
                      checked={selectedScenario === scenario.value}
                      onChange={(e) => setSelectedScenario(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{scenario.label}</div>
                      <div className="text-sm text-gray-600">{scenario.description}</div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleApiCall}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? 'Calling API...' : 'Test API Call'}
            </Button>

            <Button
              onClick={handleManualError}
              variant="outline"
              className="min-w-[120px]"
            >
              Test Error Toast
            </Button>

            {canRetry && (
              <Button
                onClick={retry}
                variant="secondary"
                className="min-w-[120px]"
              >
                Retry ({3 - retryCount} left)
              </Button>
            )}
          </div>

          {/* Status Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">API Call Status</h4>
              <div className="space-y-2 text-sm">
                <div><strong>State:</strong> {loadingState}</div>
                <div><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
                <div><strong>Retry Count:</strong> {retryCount}</div>
                <div><strong>Can Retry:</strong> {canRetry ? 'Yes' : 'No'}</div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Response Data</h4>
              <div className="text-sm">
                {data ? (
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                ) : (
                  <span className="text-gray-500">No data received</span>
                )}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="border rounded-lg p-4 bg-red-50">
              <h4 className="font-semibold mb-2">Error Details</h4>
              <ErrorMessage
                error={error}
                variant="card"
                showErrorType={true}
                showRetryCount={true}
                retryCount={retryCount}
                onRetry={canRetry ? retry : undefined}
              />
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">How to Test</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Select different scenarios to test various error types</li>
              <li>Observe how errors are categorized and displayed</li>
              <li>Note the retry behavior for retryable errors</li>
              <li>Watch toast notifications appear in the top-right corner</li>
              <li>Test the retry functionality when available</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};