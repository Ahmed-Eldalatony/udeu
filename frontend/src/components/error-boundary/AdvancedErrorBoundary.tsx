import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '../ui/button';
import { RefreshCw, Home, Bug, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, errorType: ErrorType) => void;
  showDetails?: boolean;
  enableReporting?: boolean;
  maxRetryAttempts?: number;
  resetTimeout?: number;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorType: ErrorType;
  retryCount: number;
  isRetrying: boolean;
}

export enum ErrorType {
  RUNTIME = 'runtime',
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

export class AdvancedErrorBoundary extends Component<Props, State> {
  private resetTimeoutId?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorType: ErrorType.UNKNOWN,
      retryCount: 0,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorType = AdvancedErrorBoundary.categorizeError(error);
    return {
      hasError: true,
      error,
      errorType
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorType = this.categorizeError(error);

    console.error('AdvancedErrorBoundary caught an error:', {
      error: error.message,
      type: errorType,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });

    this.setState({
      error,
      errorInfo,
      errorType
    });

    // Report error if enabled
    if (this.props.enableReporting) {
      this.reportError(error, errorInfo, errorType);
    }

    // Call the optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorType);
    }
  }

  private static categorizeError(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    if (message.includes('network') || message.includes('fetch') || message.includes('api')) {
      return ErrorType.NETWORK;
    }

    if (message.includes('unauthorized') || message.includes('forbidden') || message.includes('auth')) {
      return ErrorType.AUTH;
    }

    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION;
    }

    if (stack.includes('react') || stack.includes('jsx') || stack.includes('component')) {
      return ErrorType.RUNTIME;
    }

    return ErrorType.UNKNOWN;
  }

  private categorizeError(error: Error): ErrorType {
    return AdvancedErrorBoundary.categorizeError(error);
  }

  private reportError(error: Error, errorInfo: ErrorInfo, errorType: ErrorType) {
    // This could be extended to send to error reporting services like Sentry, LogRocket, etc.
    const errorReport = {
      message: error.message,
      type: errorType,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount
    };

    // For now, just log to console. In production, this would send to your error reporting service
    console.error('Error Report:', errorReport);

    // Example: Send to error reporting service
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { contexts: { errorInfo } });
    // }
  }

  handleRetry = async () => {
    const maxRetries = this.props.maxRetryAttempts || 3;

    if (this.state.retryCount >= maxRetries) {
      console.warn('Maximum retry attempts reached');
      return;
    }

    this.setState({ isRetrying: true });

    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1,
      isRetrying: false
    }));

    // Auto-reset retry count after timeout
    const resetTimeout = this.props.resetTimeout || 30000; // 30 seconds
    this.resetTimeoutId = setTimeout(() => {
      this.setState({ retryCount: 0 });
    }, resetTimeout);
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  private getErrorConfig(errorType: ErrorType) {
    const configs = {
      [ErrorType.RUNTIME]: {
        title: 'Application Error',
        message: 'Something went wrong with the application. Please try refreshing the page.',
        icon: <Bug className="w-8 h-8 text-red-500" />,
        showRetry: true,
        showHome: false
      },
      [ErrorType.NETWORK]: {
        title: 'Connection Error',
        message: 'Unable to connect to our servers. Please check your internet connection and try again.',
        icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
        showRetry: true,
        showHome: false
      },
      [ErrorType.AUTH]: {
        title: 'Authentication Error',
        message: 'Your session has expired or you don\'t have permission to access this resource.',
        icon: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
        showRetry: false,
        showHome: true
      },
      [ErrorType.VALIDATION]: {
        title: 'Data Error',
        message: 'There was an issue with the data provided. Please check your input and try again.',
        icon: <AlertTriangle className="w-8 h-8 text-blue-500" />,
        showRetry: true,
        showHome: false
      },
      [ErrorType.UNKNOWN]: {
        title: 'Unexpected Error',
        message: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
        icon: <AlertTriangle className="w-8 h-8 text-gray-500" />,
        showRetry: true,
        showHome: false
      }
    };

    return configs[errorType];
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const config = this.getErrorConfig(this.state.errorType);
      const maxRetries = this.props.maxRetryAttempts || 3;
      const canRetry = config.showRetry && this.state.retryCount < maxRetries;

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="text-center space-y-6">
              {config.icon}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {config.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {config.message}
                </p>
                {this.state.retryCount > 0 && (
                  <p className="text-sm text-gray-500 mb-4">
                    Retry attempt {this.state.retryCount} of {maxRetries}
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-3">
                {canRetry && (
                  <Button
                    onClick={this.handleRetry}
                    disabled={this.state.isRetrying}
                    className="w-full"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${this.state.isRetrying ? 'animate-spin' : ''}`} />
                    {this.state.isRetrying ? 'Retrying...' : 'Try Again'}
                  </Button>
                )}

                {config.showHome && (
                  <Button
                    variant="outline"
                    onClick={this.handleGoHome}
                    className="w-full"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go to Homepage
                  </Button>
                )}
              </div>
            </div>

            {this.props.showDetails && this.state.errorInfo && (
              <details className="mt-6 p-4 bg-gray-100 rounded-lg text-sm">
                <summary className="cursor-pointer font-medium text-gray-700">
                  Technical Details
                </summary>
                <div className="mt-2 space-y-2 text-xs text-gray-600">
                  <div>
                    <strong>Error Type:</strong> {this.state.errorType}
                  </div>
                  <div>
                    <strong>Message:</strong> {this.state.error?.message}
                  </div>
                  <pre className="mt-2 overflow-auto max-h-32">
                    {this.state.error?.stack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}