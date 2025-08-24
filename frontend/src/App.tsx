import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { GlobalStateProvider } from './contexts/GlobalStateContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { ErrorProvider, useError } from './contexts/ErrorContext';
import { GlobalLoadingOverlay } from './components/ui/global-loading-overlay';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdvancedErrorBoundary, RouteErrorBoundary, ErrorTestComponent } from './components/error-boundary';
import { ToastContainer } from './components/ui/toast';
import { LogoutTestComponent } from './components/auth/LogoutTestComponent';
import { Homepage } from './components/pages/homepage';
import { LoginPage } from './components/pages/login-page';
import { RegisterPage } from './components/pages/register-page';
import { CoursesPage } from './components/pages/courses-page';
import { CourseDetailsPage } from './components/pages/course-details-page';
import { DashboardPage } from './components/pages/dashboard-page';
import { InstructorDashboard } from './components/pages/instructor-dashboard';
import { CartPage } from './components/pages/cart-page';
import { NotFoundPage } from './components/pages/not-found-page';
import { AdminPage } from './components/pages/admin-page';
import { ErrorHandlingDemo } from './components/ui/error-handling-demo';

function AppContent() {
  const { toasts, removeToast } = useError();

  return (
    <AdvancedErrorBoundary
      enableReporting={true}
      showDetails={process.env.NODE_ENV === 'development'}
      maxRetryAttempts={3}
      resetTimeout={30000}
      onError={(error, errorInfo, errorType) => {
        // Custom error handling - could send to analytics service
        console.error('App-level error:', { error, errorInfo, errorType });
      }}
    >
      <LoadingProvider>
        <GlobalStateProvider>
          <AuthProvider>
            <CartProvider>
              <GlobalLoadingOverlay />
              <ToastContainer toasts={toasts} onClose={removeToast} />
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/" element={
                    <RouteErrorBoundary route="Homepage">
                      <Homepage />
                    </RouteErrorBoundary>
                  } />
                  <Route path="/login" element={
                    <ProtectedRoute requireAuth={false}>
                      <RouteErrorBoundary route="Login">
                        <LoginPage />
                      </RouteErrorBoundary>
                    </ProtectedRoute>
                  } />
                  <Route path="/register" element={
                    <ProtectedRoute requireAuth={false}>
                      <RouteErrorBoundary route="Register">
                        <RegisterPage />
                      </RouteErrorBoundary>
                    </ProtectedRoute>
                  } />
                  <Route path="/courses" element={
                    <RouteErrorBoundary route="Courses">
                      <CoursesPage />
                    </RouteErrorBoundary>
                  } />
                  <Route path="/courses/:id" element={
                    <RouteErrorBoundary route="CourseDetails">
                      <CourseDetailsPage />
                    </RouteErrorBoundary>
                  } />
                  <Route path="/cart" element={
                    <RouteErrorBoundary route="Cart">
                      <CartPage />
                    </RouteErrorBoundary>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <RouteErrorBoundary route="Dashboard">
                        <DashboardPage />
                      </RouteErrorBoundary>
                    </ProtectedRoute>
                  } />
                  <Route path="/instructor-dashboard" element={
                    <ProtectedRoute requireInstructor={true}>
                      <RouteErrorBoundary route="InstructorDashboard">
                        <InstructorDashboard />
                      </RouteErrorBoundary>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                      <RouteErrorBoundary route="Admin">
                        <AdminPage />
                      </RouteErrorBoundary>
                    </ProtectedRoute>
                  } />
                  <Route path="/error-test" element={
                    <RouteErrorBoundary route="ErrorTest">
                      <ErrorTestComponent />
                    </RouteErrorBoundary>
                  } />
                  <Route path="/error-handling-demo" element={
                    <RouteErrorBoundary route="ErrorHandlingDemo">
                      <ErrorHandlingDemo />
                    </RouteErrorBoundary>
                  } />
                  <Route path="/logout-test" element={
                    <RouteErrorBoundary route="LogoutTest">
                      <LogoutTestComponent />
                    </RouteErrorBoundary>
                  } />
                  <Route path="*" element={
                    <RouteErrorBoundary route="NotFound">
                      <NotFoundPage />
                    </RouteErrorBoundary>
                  } />
                </Routes>
              </div>
            </CartProvider>
          </AuthProvider>
        </GlobalStateProvider>
      </LoadingProvider>
    </AdvancedErrorBoundary>
  );
}

function App() {
  return (
    <ErrorProvider enableReporting={process.env.NODE_ENV === 'production'}>
      <AppContent />
    </ErrorProvider>
  );
}

export default App;
