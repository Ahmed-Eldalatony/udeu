import React, { useState } from 'react';
import { Button } from '../ui/button';

/**
 * Test component to verify error boundary functionality
 * This component provides buttons to trigger different types of errors
 */
export const ErrorTestComponent: React.FC = () => {
  const [errorType, setErrorType] = useState<string>('');

  const triggerRuntimeError = () => {
    // This will cause a runtime error
    throw new Error('Test runtime error - this should be caught by the error boundary');
  };

  const triggerNetworkError = () => {
    // Simulate a network error
    throw new Error('Network error: Failed to fetch data from API');
  };

  const triggerAuthError = () => {
    // Simulate an authentication error
    throw new Error('Unauthorized: Session expired');
  };

  const triggerAsyncError = async () => {
    // Simulate an async error
    await new Promise(resolve => setTimeout(resolve, 100));
    throw new Error('Async operation failed');
  };

  const triggerComponentError = () => {
    // This will cause a component rendering error
    const nullValue: any = null;
    return (<div>{nullValue.map(() => 'This will crash')}</div>);
  };

  const handleAsyncError = async () => {
    try {
      await triggerAsyncError();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Error Boundary Test Component
        </h2>
        <p className="text-gray-600 mb-6">
          Use these buttons to test different error scenarios and verify that the error boundaries work correctly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Runtime Errors</h3>
          <Button
            onClick={triggerRuntimeError}
            variant="outline"
            className="w-full justify-start border-red-300 text-red-700 hover:bg-red-50"
          >
            Trigger Runtime Error
          </Button>
          <Button
            onClick={triggerComponentError}
            variant="outline"
            className="w-full justify-start border-red-300 text-red-700 hover:bg-red-50"
          >
            Trigger Component Error
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Network & Auth Errors</h3>
          <Button
            onClick={triggerNetworkError}
            variant="outline"
            className="w-full justify-start border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            Trigger Network Error
          </Button>
          <Button
            onClick={triggerAuthError}
            variant="outline"
            className="w-full justify-start border-yellow-300 text-yellow-700 hover:bg-yellow-50"
          >
            Trigger Auth Error
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Async Errors</h3>
        <Button
          onClick={handleAsyncError}
          variant="outline"
          className="w-full justify-start border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          Trigger Async Error
        </Button>
      </div>

      {errorType && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            Last error type: <strong>{errorType}</strong>
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">What to expect:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Runtime errors should show a red-themed error with retry option</li>
          <li>• Network errors should show an orange-themed error with retry option</li>
          <li>• Auth errors should show a yellow-themed error with "Go to Homepage" option</li>
          <li>• In development mode, error details should be visible</li>
          <li>• The app should not crash completely - error boundaries should catch all errors</li>
        </ul>
      </div>
    </div>
  );
};