// Frontend-specific Type Definitions
import type { ReactNode, User, Course, CartItem, Payment, MouseEvent, FormEvent, ChangeEvent } from './index';

// React Component Props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}

// Layout Components
export interface NavbarProps extends BaseComponentProps {
  isAuthenticated?: boolean;
  user?: User;
  onLogout?: () => void;
}

export interface FooterProps extends BaseComponentProps {
  showNewsletter?: boolean;
  showSocialLinks?: boolean;
}

export interface LayoutProps extends BaseComponentProps {
  showNavbar?: boolean;
  showFooter?: boolean;
}

// Page Components
export interface PageProps extends BaseComponentProps {
  title?: string;
  description?: string;
}

export interface ProtectedRouteProps extends BaseComponentProps {
  requireAuth?: boolean;
  requireInstructor?: boolean;
  requireAdmin?: boolean;
  fallbackPath?: string;
  children: ReactNode;
}

// Course Components
export interface CourseCardProps extends BaseComponentProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  onAddToCart?: (courseId: string) => void;
  showInstructor?: boolean;
  showRating?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface CourseGridProps extends BaseComponentProps {
  courses: Course[];
  loading?: boolean;
  error?: string;
  onCourseClick?: (course: Course) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface CourseSearchProps extends BaseComponentProps {
  onSearch?: (query: string) => void;
  onFilter?: (filters: CourseFilters) => void;
  placeholder?: string;
  showFilters?: boolean;
}

export interface CourseFilters {
  category?: string;
  level?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  sortBy?: 'price' | 'rating' | 'students' | 'date';
}

// Cart Components
export interface CartItemProps extends BaseComponentProps {
  item: CartItem;
  onRemove?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
}

export interface CartSummaryProps extends BaseComponentProps {
  items: CartItem[];
  onCheckout?: () => void;
  loading?: boolean;
}

// UI Components
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  name?: string;
}

export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

export interface ErrorMessageProps extends BaseComponentProps {
  error: string | Error;
  onRetry?: () => void;
  showRetry?: boolean;
}

export interface ProgressBarProps extends BaseComponentProps {
  value: number; // 0-100
  max?: number;
  showLabel?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

// Form Components
export interface FormFieldProps extends BaseComponentProps {
  name: string;
  label?: string;
  error?: string;
  required?: boolean;
  description?: string;
}

export interface FormProps extends BaseComponentProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
  error?: string;
  success?: string;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export interface CartContextType {
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
}

export interface GlobalStateContextType {
  isLoading: boolean;
  isInitialized: boolean;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  setLoading: (loading: boolean) => void;
  initializeApp: () => Promise<void>;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  sound: boolean;
}

// Hook Types
export interface UseApiOptions {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

// API Client Types
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
}

// Utility Types for Frontend
export type ComponentVariant<T extends string> = {
  [K in T]: `${K}`;
};

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type ThemeMode = 'light' | 'dark' | 'system';

// Event Handler Types
export type ChangeEventHandler<T = string> = (value: T) => void;
export type ClickEventHandler = (event: MouseEvent) => void;
export type SubmitEventHandler = (event: FormEvent) => void;
export type InputEventHandler = (event: ChangeEvent<HTMLInputElement>) => void;

// Route Types
export interface RouteConfig {
  path: string;
  element: ReactNode;
  title?: string;
  requiresAuth?: boolean;
  requiresInstructor?: boolean;
  requiresAdmin?: boolean;
}

// Modal/Dialog Types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}