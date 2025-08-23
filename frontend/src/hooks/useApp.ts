import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useGlobalState } from '@/contexts/GlobalStateContext';

export const useApp = () => {
  const auth = useAuth();
  const cart = useCart();
  const globalState = useGlobalState();

  return {
    // Auth state
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isAuthLoading: auth.isLoading,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    updateUser: auth.updateUser,

    // Cart state
    cartItems: cart.items,
    cartTotalItems: cart.totalItems,
    cartTotalPrice: cart.totalPrice,
    isCartLoading: cart.isLoading,
    cartError: cart.error,
    addToCart: cart.addToCart,
    removeFromCart: cart.removeFromCart,
    clearCart: cart.clearCart,
    updateCartQuantity: cart.updateQuantity,
    isInCart: cart.isInCart,
    getCartItem: cart.getCartItem,
    refreshCart: cart.refreshCart,

    // Global state
    appSettings: globalState.settings,
    isAppLoading: globalState.isLoading,
    isAppInitialized: globalState.isInitialized,
    updateSettings: globalState.updateSettings,
    resetSettings: globalState.resetSettings,

    // Combined loading states
    isLoading: auth.isLoading || cart.isLoading || globalState.isLoading,
    isInitialized: globalState.isInitialized,

    // Utility functions
    isLoggedIn: !!auth.user,
    hasItemsInCart: cart.totalItems > 0,
    isInstructor: auth.user?.role === 'instructor',
    isStudent: auth.user?.role === 'student',
  };
};