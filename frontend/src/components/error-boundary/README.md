# Error Boundary Components

This directory contains comprehensive error boundary components for React error handling across the application.

## Components

### 1. ErrorBoundary (Basic)

A simple error boundary that catches JavaScript errors in the component tree and displays a fallback UI.

```tsx
import { ErrorBoundary } from "./components/error-boundary";

<ErrorBoundary
  fallback={<CustomFallbackComponent />}
  onError={(error, errorInfo) => console.error("Error caught:", error)}
  showDetails={process.env.NODE_ENV === "development"}
>
  <YourComponent />
</ErrorBoundary>;
```

### 2. AdvancedErrorBoundary

A sophisticated error boundary with error categorization, retry functionality, and reporting capabilities.

```tsx
import { AdvancedErrorBoundary, ErrorType } from "./components/error-boundary";

<AdvancedErrorBoundary
  enableReporting={true}
  showDetails={process.env.NODE_ENV === "development"}
  maxRetryAttempts={3}
  resetTimeout={30000}
  onError={(error, errorInfo, errorType) => {
    // Custom error handling logic
    console.error("Advanced error caught:", { error, errorInfo, errorType });
  }}
>
  <YourComponent />
</AdvancedErrorBoundary>;
```

### 3. RouteErrorBoundary

A specialized error boundary for individual routes with route-specific error handling.

```tsx
import { RouteErrorBoundary } from "./components/error-boundary";

<RouteErrorBoundary
  route="Dashboard"
  onError={(error, errorInfo, route) => {
    console.error(`Error in route ${route}:`, error);
  }}
>
  <DashboardComponent />
</RouteErrorBoundary>;
```

### 4. withRouteErrorBoundary HOC

A Higher-Order Component for easy route error boundary wrapping.

```tsx
import { withRouteErrorBoundary } from "./components/error-boundary";

const DashboardWithErrorBoundary = withRouteErrorBoundary(
  DashboardComponent,
  "Dashboard",
  (error, errorInfo, route) => {
    console.error(`Error in ${route}:`, error);
  }
);
```

## Error Types

The `AdvancedErrorBoundary` categorizes errors into the following types:

- **RUNTIME**: General JavaScript/React errors
- **NETWORK**: API and network-related errors
- **AUTH**: Authentication and authorization errors
- **VALIDATION**: Data validation errors
- **UNKNOWN**: Uncategorized errors

## Testing Error Boundaries

Visit `/error-test` in development to access the error testing interface. This page provides buttons to trigger different types of errors and verify that the error boundaries work correctly.

### Test Scenarios

1. **Runtime Error**: Triggers a general JavaScript error
2. **Component Error**: Causes a React component rendering error
3. **Network Error**: Simulates API/network failures
4. **Auth Error**: Tests authentication error handling
5. **Async Error**: Tests error handling in async operations

## Error Reporting

The `AdvancedErrorBoundary` includes built-in error reporting functionality. To integrate with external error reporting services:

```tsx
<AdvancedErrorBoundary
  enableReporting={true}
  onError={(error, errorInfo, errorType) => {
    // Example: Send to Sentry
    if (window.Sentry) {
      window.Sentry.captureException(error, { contexts: { errorInfo } });
    }

    // Example: Send to LogRocket
    if (window.LogRocket) {
      window.LogRocket.captureException(error);
    }
  }}
>
  <YourApp />
</AdvancedErrorBoundary>
```

## Configuration Options

### AdvancedErrorBoundary Props

- `enableReporting`: Enable/disable error reporting (default: false)
- `showDetails`: Show error details in development (default: false)
- `maxRetryAttempts`: Maximum number of retry attempts (default: 3)
- `resetTimeout`: Time in ms to reset retry count (default: 30000)
- `onError`: Custom error handler callback
- `fallback`: Custom fallback component

### ErrorBoundary Props

- `fallback`: Custom fallback component
- `onError`: Error handler callback
- `showDetails`: Show error details (default: false)

## Best Practices

1. **Use AdvancedErrorBoundary at the App Level**: Wrap your entire application with `AdvancedErrorBoundary` for comprehensive error catching.

2. **Use RouteErrorBoundary for Pages**: Wrap individual routes with `RouteErrorBoundary` for granular error handling.

3. **Enable Error Reporting in Production**: Set `enableReporting={true}` in production environments.

4. **Show Details Only in Development**: Use `showDetails={process.env.NODE_ENV === 'development'}` to avoid exposing sensitive information.

5. **Custom Error Fallbacks**: Provide custom fallback components for better user experience.

6. **Log Errors Appropriately**: Implement proper error logging and monitoring.

## Example Implementation

The main App.tsx demonstrates the recommended implementation pattern:

```tsx
function App() {
  return (
    <AdvancedErrorBoundary
      enableReporting={true}
      showDetails={process.env.NODE_ENV === "development"}
      maxRetryAttempts={3}
      resetTimeout={30000}
      onError={(error, errorInfo, errorType) => {
        console.error("App-level error:", { error, errorInfo, errorType });
      }}
    >
      <GlobalStateProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <RouteErrorBoundary route="Homepage">
                    <Homepage />
                  </RouteErrorBoundary>
                }
              />
              {/* Other routes with RouteErrorBoundary */}
            </Routes>
          </CartProvider>
        </AuthProvider>
      </GlobalStateProvider>
    </AdvancedErrorBoundary>
  );
}
```

This implementation provides multiple layers of error protection:

- App-level error boundary catches application-wide errors
- Route-level error boundaries catch page-specific errors
- Custom error handling and reporting
- Retry mechanisms for recoverable errors
- Development-friendly error details
