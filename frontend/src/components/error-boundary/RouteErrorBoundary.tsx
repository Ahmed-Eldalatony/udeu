import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface RouteErrorBoundaryProps {
  children: ReactNode;
  route: string;
  onError?: (error: Error, errorInfo: ErrorInfo, route: string) => void;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Route error on ${this.props.route}:`, error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo, this.props.route);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Page Error
              </h2>
              <p className="text-gray-600 mb-4">
                Something went wrong loading this page. This might be a temporary issue.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Go Back
                </button>
                <a
                  href="/"
                  className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-center"
                >
                  Go to Homepage
                </a>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 p-3 bg-red-50 rounded text-left">
                  <summary className="cursor-pointer font-medium text-red-800">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs text-red-700 overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for easier usage with routes
export function withRouteErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  route: string,
  onError?: (error: Error, errorInfo: ErrorInfo, route: string) => void
) {
  const WithRouteErrorBoundaryComponent = (props: P) => (
    <RouteErrorBoundary route={route} onError={onError}>
      <WrappedComponent {...props} />
    </RouteErrorBoundary>
  );

  WithRouteErrorBoundaryComponent.displayName = `withRouteErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithRouteErrorBoundaryComponent;
}