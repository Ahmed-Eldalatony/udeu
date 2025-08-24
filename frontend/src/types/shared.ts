// Frontend Shared Types (Synchronized with shared/types/index.ts)

// Enums
export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin'
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  ALL_LEVELS = 'all_levels'
}

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
  ARCHIVED = 'archived'
}

export enum EnrollmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
  EXPIRED = 'expired'
}

export enum ProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum LectureType {
  VIDEO = 'video',
  TEXT = 'text',
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
  DOWNLOAD = 'download'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  FREE = 'free'
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  CAD = 'CAD',
  AUD = 'AUD',
  INR = 'INR'
}

// Interfaces
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    bio?: string;
    description?: string;
    role: UserRole;
    skills?: string; // JSON string of skills array
    website?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
    isEmailVerified: boolean;
    isTwoFactorEnabled: boolean; // Added to match backend entity
    isActive: boolean;
    createdAt: string; // Changed to string for API compatibility
    updatedAt: string; // Changed to string for API compatibility
  }

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  instructor: User;
  instructorId: string;
  objectives?: string[];
  requirements?: string[];
  targetAudience?: string[];
  level: CourseLevel;
  status: CourseStatus;
  price: number;
  salePrice?: number;
  category?: string;
  tags?: string[];
  totalDuration: number;
  totalLectures: number;
  totalStudents: number;
  rating: number;
  totalReviews: number;
  isFree: boolean;
  isPublished: boolean;
  publishedAt?: Date;
  welcomeMessage?: string;
  congratulationsMessage?: string;
  curriculum?: any;
  faq?: any;
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string;
  allowComments: boolean;
  featured: boolean;
  popularityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  user: User;
  userId: string;
  course: Course;
  courseId: string;
  status: EnrollmentStatus;
  amountPaid: number;
  progressPercentage: number;
  completedLectures: number;
  completedAt?: Date;
  lastAccessedAt?: Date;
  totalTimeWatched: number;
  notes?: string[];
  bookmarks?: string[];
  hasCertificate: boolean;
  certificateUrl?: string;
  certificateIssuedAt?: Date;
  rating: number;
  review?: string;
  reviewedAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Progress {
  id: string;
  user: User;
  userId: string;
  course: Course;
  courseId: string;
  lectureId: string;
  lectureTitle: string;
  lectureType: LectureType;
  status: ProgressStatus;
  watchTime: number;
  totalDuration: number;
  completionPercentage: number;
  attempts: number;
  score?: number;
  isCompleted: boolean;
  completedAt?: Date;
  lastAccessedAt?: Date;
  notes?: string;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
   id: string;
   user: User;
   userId: string;
   course?: Course;
   courseId?: string;
   status: PaymentStatus | string; // Allow both enum and string for API compatibility
   paymentMethod: PaymentMethod | string; // Allow both enum and string for API compatibility
   currency: Currency | string; // Allow both enum and string for API compatibility
   amount: number;
   fee: number; // Platform fee
   tax: number;
   netAmount: number; // Amount after fees and taxes
   transactionId?: string; // External payment processor ID
   paymentIntentId?: string; // Stripe payment intent ID
   paymentMetadata?: Record<string, any>; // Additional payment data
   description?: string;
   invoiceUrl?: string;
   receiptUrl?: string;
   isRefunded: boolean;
   refundedAmount: number;
   refundedAt?: string; // Changed to string for API compatibility
   refundReason?: string;
   isSubscription: boolean;
   subscriptionId?: string;
   billingCycle?: string; // monthly, yearly
   customerInfo?: Record<string, any>; // Billing address, card details (masked)
   errorDetails?: Record<string, any>; // Error information if payment failed
   isActive: boolean;
   createdAt: string; // Changed to string for API compatibility
   updatedAt: string; // Changed to string for API compatibility
 }

// Cart Item (for frontend)
export interface CartItem {
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

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// React-like types for shared compatibility
export type ReactNode = any;
export type MouseEvent = any;
export type FormEvent = any;
export type ChangeEvent = any;