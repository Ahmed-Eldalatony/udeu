import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useGlobalState } from '../contexts/GlobalStateContext';
import { useNavigate } from 'react-router-dom';

/**
 * Comprehensive logout service that handles logout across all contexts
 * and ensures complete cleanup of authentication state, user data, and sensitive information
 */
export const useLogoutService = () => {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  const { clearAllCartData } = useCart();
  const { clearAllState } = useGlobalState();

  const performLogout = async (redirectTo: string = '/login') => {
    try {
      console.log('Starting comprehensive logout process...');

      // Step 1: Clear authentication state
      console.log('Clearing authentication state...');
      authLogout();

      // Step 2: Clear cart data
      console.log('Clearing cart data...');
      clearAllCartData();

      // Step 3: Clear global app state
      console.log('Clearing global app state...');
      clearAllState();

      // Step 4: Clear any other sensitive data from localStorage/sessionStorage
      console.log('Clearing additional stored data...');
      clearAdditionalStoredData();

      // Step 5: Navigate to login page
      console.log('Redirecting to login page...');
      navigate(redirectTo, { replace: true });

      console.log('Logout process completed successfully');
    } catch (error) {
      console.error('Error during logout process:', error);

      // Even if there's an error, attempt to clear critical data
      try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('course_cart');
        localStorage.removeItem('app_settings');
      } catch (cleanupError) {
        console.error('Error during emergency cleanup:', cleanupError);
      }

      // Force navigation to login page
      navigate(redirectTo, { replace: true });
    }
  };

  return {
    performLogout
  };
};

/**
 * Utility function to clear additional stored data
 */
const clearAdditionalStoredData = () => {
  const keysToRemove = [
    'user_preferences',
    'search_history',
    'recent_courses',
    'notifications',
    'theme_preference',
    'language_preference'
  ];

  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove ${key} from storage:`, error);
    }
  });
};

/**
 * Hook for components that need to handle logout with navigation
 */
export const useLogoutWithNavigation = () => {
  const logoutService = useLogoutService();

  const logout = (redirectTo?: string) => {
    logoutService.performLogout(redirectTo);
  };

  return { logout };
};

/**
 * Utility function for programmatic logout without hooks
 * Useful for scenarios where hooks cannot be used (e.g., error boundaries, API interceptors)
 */
export const performProgrammaticLogout = () => {
  try {
    // Clear authentication token
    localStorage.removeItem('access_token');

    // Clear cart data
    localStorage.removeItem('course_cart');

    // Clear app settings
    localStorage.removeItem('app_settings');

    // Clear additional data
    clearAdditionalStoredData();

    // Redirect to login
    window.location.href = '/login';

    console.log('Programmatic logout completed');
  } catch (error) {
    console.error('Error during programmatic logout:', error);
    // Force redirect even if there are errors
    window.location.href = '/login';
  }
};