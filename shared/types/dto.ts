// DTO Types for API Operations
import type { UserRole, CourseLevel, CourseStatus, EnrollmentStatus, PaymentStatus, PaymentMethod, Currency } from './index';

// Authentication DTOs
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
  };
  access_token: string;
  refresh_token?: string;
}

// User DTOs
export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  profilePicture?: string;
  bio?: string;
  description?: string;
  skills?: string[];
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  description?: string;
  skills?: string[];
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  isActive?: boolean;
}

// Course DTOs
export interface CreateCourseDto {
  title: string;
  description: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  instructorId: string;
  objectives?: string[];
  requirements?: string[];
  targetAudience?: string[];
  level?: CourseLevel;
  price: number;
  salePrice?: number;
  category?: string;
  tags?: string[];
  curriculum?: any; // JSON structure for course content
  faq?: any; // JSON structure for FAQ
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string;
  allowComments?: boolean;
  featured?: boolean;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  objectives?: string[];
  requirements?: string[];
  targetAudience?: string[];
  level?: CourseLevel;
  price?: number;
  salePrice?: number;
  category?: string;
  tags?: string[];
  curriculum?: any;
  faq?: any;
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string;
  allowComments?: boolean;
  featured?: boolean;
}

// Enrollment DTOs
export interface CreateEnrollmentDto {
  courseId: string;
  paymentMethod?: PaymentMethod;
  amount?: number;
}

export interface UpdateEnrollmentDto {
  status?: EnrollmentStatus;
  progressPercentage?: number;
  completedLectures?: number;
  totalTimeWatched?: number;
  notes?: string[];
  bookmarks?: string[];
  rating?: number; // 1-5
  review?: string;
}

// Payment DTOs
export interface CreatePaymentDto {
  courseId?: string;
  amount: number;
  currency?: Currency;
  paymentMethod?: PaymentMethod;
  description?: string;
  customerInfo?: {
    email: string;
    name: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

// Progress DTOs
export interface CreateProgressDto {
  courseId: string;
  lectureId: string;
  lectureTitle: string;
  lectureType?: string;
  totalDuration?: number;
}

export interface UpdateProgressDto {
  status?: string;
  watchTime?: number;
  completionPercentage?: number;
  attempts?: number;
  score?: number;
  notes?: string;
  isBookmarked?: boolean;
}

// Search DTOs
export interface SearchCoursesDto {
  query?: string;
  category?: string;
  level?: CourseLevel;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  instructor?: string;
  tags?: string[];
  sortBy?: 'relevance' | 'price' | 'rating' | 'students' | 'date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Query Parameters
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
}

// Response Types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode: number;
  errors?: ValidationError[];
  timestamp: string;
  path?: string;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  statusCode: number;
  timestamp: string;
}

// Utility Types for DTOs
export type OptionalDto<T> = {
  [P in keyof T]?: T[P] | null;
};

export type RequiredDto<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;