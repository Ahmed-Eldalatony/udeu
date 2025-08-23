// Shared Type Definitions for Full-Stack Application
// These types can be used by both backend and frontend

// User Types
export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin'
}

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
   createdAt: Date;
   updatedAt: Date;
 }

// Course Types
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

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  instructor: User;
  instructorId: string;
  objectives?: string; // JSON string of learning objectives
  requirements?: string; // JSON string of prerequisites
  targetAudience?: string; // JSON string of target audience
  level: CourseLevel;
  status: CourseStatus;
  price: number;
  salePrice?: number;
  category?: string;
  tags?: string; // JSON string of tags
  totalDuration: number; // in minutes
  totalLectures: number;
  totalStudents: number;
  rating: number;
  totalReviews: number;
  isFree: boolean;
  isPublished: boolean;
  publishedAt?: Date;
  welcomeMessage?: string;
  congratulationsMessage?: string;
  curriculum?: string; // JSON string of course structure
  faq?: string; // JSON string of FAQ
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string;
  allowComments: boolean;
  featured: boolean;
  popularityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// Enrollment Types
export enum EnrollmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
  EXPIRED = 'expired'
}

export interface Enrollment {
  id: string;
  user: User;
  userId: string;
  course: Course;
  courseId: string;
  status: EnrollmentStatus;
  amountPaid: number;
  progressPercentage: number; // 0-100
  completedLectures: number;
  completedAt?: Date;
  lastAccessedAt?: Date;
  totalTimeWatched: number; // in seconds
  notes?: string; // JSON string of student notes
  bookmarks?: string; // JSON string of bookmarked lectures
  hasCertificate: boolean;
  certificateUrl?: string;
  certificateIssuedAt?: Date;
  rating: number; // 1-5 stars
  review?: string;
  reviewedAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Progress Types
export enum LectureType {
  VIDEO = 'video',
  TEXT = 'text',
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
  DOWNLOAD = 'download'
}

export enum ProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export interface Progress {
  id: string;
  user: User;
  userId: string;
  course: Course;
  courseId: string;
  lectureId: string; // Reference to lecture/section
  lectureTitle: string;
  lectureType: LectureType;
  status: ProgressStatus;
  watchTime: number; // in seconds
  totalDuration: number; // in seconds
  completionPercentage: number; // 0-100
  attempts: number; // For quizzes/assignments
  score?: number; // For quizzes/assignments
  isCompleted: boolean;
  completedAt?: Date;
  lastAccessedAt?: Date;
  notes?: string; // Student notes for the lecture
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Types
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

export interface Payment {
  id: string;
  user: User;
  userId: string;
  course?: Course;
  courseId?: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  currency: Currency;
  amount: number;
  fee: number; // Platform fee
  tax: number;
  netAmount: number; // Amount after fees and taxes
  transactionId?: string; // External payment processor ID
  paymentIntentId?: string; // Stripe payment intent ID
  paymentMetadata?: any; // Additional payment data
  description?: string;
  invoiceUrl?: string;
  receiptUrl?: string;
  isRefunded: boolean;
  refundedAmount: number;
  refundedAt?: Date;
  refundReason?: string;
  isSubscription: boolean;
  subscriptionId?: string;
  billingCycle?: string; // monthly, yearly
  customerInfo?: any; // Billing address, card details (masked)
  errorDetails?: any; // Error information if payment failed
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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

// Cart Types (Frontend-specific but shared)
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

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Generic Types for React-like environments
export type ReactNode = any;
export type MouseEvent = any;
export type FormEvent = any;
export type ChangeEvent<T = any> = any;