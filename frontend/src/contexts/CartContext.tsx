import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  courseId: string;
  course: {
    id: string;
    title: string;
    price: number;
    isFree: boolean;
    thumbnailUrl?: string;
    instructor: {
      firstName: string;
      lastName: string;
    };
  };
  quantity: number;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (courseId: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  isInCart: (courseId: string) => boolean;
  getCartItem: (courseId: string) => CartItem | undefined;
  refreshCart: () => Promise<void>;
  clearAllCartData: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('course_cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          // Convert date strings back to Date objects
          const cartWithDates = parsedCart.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }));
          setItems(cartWithDates);
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        localStorage.removeItem('course_cart');
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('course_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items]);

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.course.price * item.quantity), 0);

  const addToCart = async (courseId: string) => {
    if (!user) {
      setError('Please log in to add courses to your cart');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if course is already in cart
      const existingItem = items.find(item => item.courseId === courseId);

      if (existingItem) {
        // Update quantity if already in cart
        await updateQuantity(existingItem.id, existingItem.quantity + 1);
      } else {
        // Fetch course details (in a real app, this would come from props or context)
        // For now, we'll create a placeholder - this should be replaced with actual course data
        const newItem: CartItem = {
          id: `cart_${Date.now()}_${courseId}`,
          courseId,
          course: {
            id: courseId,
            title: 'Course Title', // This should be fetched from API
            price: 99.99, // This should be fetched from API
            isFree: false,
            thumbnailUrl: undefined,
            instructor: {
              firstName: 'Instructor',
              lastName: 'Name'
            }
          },
          quantity: 1,
          addedAt: new Date()
        };

        setItems(prev => [...prev, newItem]);
      }
    } catch (error) {
      setError('Failed to add course to cart');
      console.error('Add to cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      setError('Failed to remove item from cart');
      console.error('Remove from cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      setItems([]);
    } catch (error) {
      setError('Failed to clear cart');
      console.error('Clear cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    } catch (error) {
      setError('Failed to update item quantity');
      console.error('Update quantity error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isInCart = (courseId: string): boolean => {
    return items.some(item => item.courseId === courseId);
  };

  const getCartItem = (courseId: string): CartItem | undefined => {
    return items.find(item => item.courseId === courseId);
  };

  const refreshCart = async () => {
    // This could be used to sync cart with backend
    // For now, it's a placeholder for future backend integration
    setError(null);
  };

  const clearAllCartData = () => {
    try {
      // Clear cart from localStorage
      localStorage.removeItem('course_cart');

      // Clear cart state
      setItems([]);
      setIsLoading(false);
      setError(null);

      console.log('Cart data cleared successfully');
    } catch (error) {
      console.error('Error clearing cart data:', error);
      // Even if there's an error, clear the state
      setItems([]);
      setIsLoading(false);
      setError(null);
    }
  };

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    isInCart,
    getCartItem,
    refreshCart,
    clearAllCartData,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};