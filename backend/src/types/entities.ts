// Backend Entity Types with TypeORM Integration
import { UserRole, CourseLevel, CourseStatus, EnrollmentStatus, ProgressStatus, LectureType, PaymentStatus, PaymentMethod, Currency } from './shared';

// User Entity Interface (for TypeORM)
export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bio?: string;
  description?: string;
  role: UserRole;
  skills?: string; // JSON stringified array
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Course Entity Interface
export interface ICourse {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  instructor: IUser;
  instructorId: string;
  objectives?: string; // JSON stringified array
  requirements?: string; // JSON stringified array
  targetAudience?: string; // JSON stringified array
  level: CourseLevel;
  status: CourseStatus;
  price: number;
  salePrice?: number;
  category?: string;
  tags?: string; // JSON stringified array
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
  curriculum?: string; // JSON stringified object
  faq?: string; // JSON stringified array
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string;
  allowComments: boolean;
  featured: boolean;
  popularityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// Enrollment Entity Interface
export interface IEnrollment {
  id: string;
  user: IUser;
  userId: string;
  course: ICourse;
  courseId: string;
  status: EnrollmentStatus;
  amountPaid: number;
  progressPercentage: number; // 0-100
  completedLectures: number;
  completedAt?: Date;
  lastAccessedAt?: Date;
  totalTimeWatched: number; // in seconds
  notes?: string; // JSON stringified array
  bookmarks?: string; // JSON stringified array
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

// Progress Entity Interface
export interface IProgress {
  id: string;
  user: IUser;
  userId: string;
  course: ICourse;
  courseId: string;
  lectureId: string;
  lectureTitle: string;
  lectureType: LectureType;
  status: ProgressStatus;
  watchTime: number; // in seconds
  totalDuration: number; // in seconds
  completionPercentage: number; // 0-100
  attempts: number;
  score?: number; // For quizzes/assignments
  isCompleted: boolean;
  completedAt?: Date;
  lastAccessedAt?: Date;
  notes?: string;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Entity Interface
export interface IPayment {
  id: string;
  user: IUser;
  userId: string;
  course?: ICourse;
  courseId?: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  currency: Currency;
  amount: number;
  fee: number;
  tax: number;
  netAmount: number;
  transactionId?: string;
  paymentIntentId?: string;
  paymentMetadata?: Record<string, any>;
  description?: string;
  invoiceUrl?: string;
  receiptUrl?: string;
  isRefunded: boolean;
  refundedAmount: number;
  refundedAt?: Date;
  refundReason?: string;
  isSubscription: boolean;
  subscriptionId?: string;
  billingCycle?: string;
  customerInfo?: Record<string, any>;
  errorDetails?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Entity Creation Types (without generated fields)
export type CreateUserData = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserData = Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateCourseData = Omit<ICourse, 'id' | 'createdAt' | 'updatedAt' | 'instructor'>;
export type UpdateCourseData = Partial<Omit<ICourse, 'id' | 'createdAt' | 'updatedAt' | 'instructor'>>;

export type CreateEnrollmentData = Omit<IEnrollment, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'course'>;
export type UpdateEnrollmentData = Partial<Omit<IEnrollment, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'course'>>;

export type CreateProgressData = Omit<IProgress, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'course'>;
export type UpdateProgressData = Partial<Omit<IProgress, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'course'>>;

export type CreatePaymentData = Omit<IPayment, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'course'>;
export type UpdatePaymentData = Partial<Omit<IPayment, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'course'>>;

// Query Types
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserQuery extends PaginationQuery {
  role?: UserRole;
  isActive?: boolean;
  search?: string;
}

export interface CourseQuery extends PaginationQuery {
  instructorId?: string;
  level?: CourseLevel;
  status?: CourseStatus;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  isFree?: boolean;
  isPublished?: boolean;
  featured?: boolean;
  search?: string;
}

export interface EnrollmentQuery extends PaginationQuery {
  userId?: string;
  courseId?: string;
  status?: EnrollmentStatus;
  isActive?: boolean;
}

export interface ProgressQuery extends PaginationQuery {
  userId?: string;
  courseId?: string;
  status?: ProgressStatus;
  lectureType?: LectureType;
}

export interface PaymentQuery extends PaginationQuery {
  userId?: string;
  courseId?: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  currency?: Currency;
  isRefunded?: boolean;
  isSubscription?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}