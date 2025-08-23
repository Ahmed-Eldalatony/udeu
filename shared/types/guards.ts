// Type Guards and Validation Utilities

import type {
  User,
  Course,
  Enrollment,
  Progress,
  Payment,
  UserRole,
  CourseLevel,
  CourseStatus,
  EnrollmentStatus,
  PaymentStatus,
  PaymentMethod,
  Currency
} from './index';

// Type Guards for Enums
export const isUserRole = (value: any): value is UserRole => {
  return ['student', 'instructor', 'admin'].includes(value);
};

export const isCourseLevel = (value: any): value is CourseLevel => {
  return ['beginner', 'intermediate', 'advanced', 'all_levels'].includes(value);
};

export const isCourseStatus = (value: any): value is CourseStatus => {
  return ['draft', 'published', 'unpublished', 'archived'].includes(value);
};

export const isEnrollmentStatus = (value: any): value is EnrollmentStatus => {
  return ['active', 'completed', 'dropped', 'expired'].includes(value);
};

export const isPaymentStatus = (value: any): value is PaymentStatus => {
  return ['pending', 'completed', 'failed', 'refunded', 'cancelled'].includes(value);
};

export const isPaymentMethod = (value: any): value is PaymentMethod => {
  return ['stripe', 'paypal', 'credit_card', 'debit_card', 'bank_transfer', 'free'].includes(value);
};

export const isCurrency = (value: any): value is Currency => {
  return ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR'].includes(value);
};

// Type Guards for Objects
export const isUser = (obj: any): obj is User => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.firstName === 'string' &&
    typeof obj.lastName === 'string' &&
    isUserRole(obj.role) &&
    typeof obj.isActive === 'boolean' &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date
  );
};

export const isCourse = (obj: any): obj is Course => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    isCourse(obj.instructor) &&
    typeof obj.instructorId === 'string' &&
    isCourseLevel(obj.level) &&
    isCourseStatus(obj.status) &&
    typeof obj.price === 'number' &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date
  );
};

export const isEnrollment = (obj: any): obj is Enrollment => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    isUser(obj.user) &&
    typeof obj.userId === 'string' &&
    isCourse(obj.course) &&
    typeof obj.courseId === 'string' &&
    isEnrollmentStatus(obj.status) &&
    typeof obj.amountPaid === 'number' &&
    typeof obj.progressPercentage === 'number' &&
    typeof obj.completedLectures === 'number' &&
    typeof obj.isActive === 'boolean' &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date
  );
};

export const isProgress = (obj: any): obj is Progress => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    isUser(obj.user) &&
    typeof obj.userId === 'string' &&
    isCourse(obj.course) &&
    typeof obj.courseId === 'string' &&
    typeof obj.lectureId === 'string' &&
    typeof obj.lectureTitle === 'string' &&
    typeof obj.watchTime === 'number' &&
    typeof obj.totalDuration === 'number' &&
    typeof obj.completionPercentage === 'number' &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date
  );
};

export const isPayment = (obj: any): obj is Payment => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    isUser(obj.user) &&
    typeof obj.userId === 'string' &&
    (obj.course === null || obj.course === undefined || isCourse(obj.course)) &&
    typeof obj.status === 'string' &&
    typeof obj.paymentMethod === 'string' &&
    typeof obj.currency === 'string' &&
    typeof obj.amount === 'number' &&
    typeof obj.fee === 'number' &&
    typeof obj.tax === 'number' &&
    typeof obj.netAmount === 'number' &&
    typeof obj.isActive === 'boolean' &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date
  );
};

// Validation Functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateRating = (rating: number): boolean => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

export const validatePercentage = (percentage: number): boolean => {
  return Number.isFinite(percentage) && percentage >= 0 && percentage <= 100;
};

export const validatePrice = (price: number): boolean => {
  return Number.isFinite(price) && price >= 0;
};

// Array Validation
export const isArrayOf = <T>(arr: any, validator: (item: any) => item is T): arr is T[] => {
  return Array.isArray(arr) && arr.every(validator);
};

export const isArrayOfStrings = (arr: any): arr is string[] => {
  return Array.isArray(arr) && arr.every(item => typeof item === 'string');
};

export const isArrayOfNumbers = (arr: any): arr is number[] => {
  return Array.isArray(arr) && arr.every(item => typeof item === 'number');
};

// Object Validation
export const hasRequiredFields = <T extends object>(
  obj: any,
  requiredFields: (keyof T)[]
): obj is T => {
  return (
    obj &&
    typeof obj === 'object' &&
    requiredFields.every(field => obj.hasOwnProperty(field) && obj[field] != null)
  );
};

// Type Assertion Functions (unsafe, use with caution)
export const assertUser = (obj: any): asserts obj is User => {
  if (!isUser(obj)) {
    throw new Error('Object is not a valid User');
  }
};

export const assertCourse = (obj: any): asserts obj is Course => {
  if (!isCourse(obj)) {
    throw new Error('Object is not a valid Course');
  }
};

export const assertEnrollment = (obj: any): asserts obj is Enrollment => {
  if (!isEnrollment(obj)) {
    throw new Error('Object is not a valid Enrollment');
  }
};

export const assertPayment = (obj: any): asserts obj is Payment => {
  if (!isPayment(obj)) {
    throw new Error('Object is not a valid Payment');
  }
};

// Utility Functions for Type Safety
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
};

export const safeJsonStringify = (obj: any, fallback: string = '{}'): string => {
  try {
    return JSON.stringify(obj);
  } catch {
    return fallback;
  }
};

export const safeNumber = (value: any, fallback: number = 0): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export const safeString = (value: any, fallback: string = ''): string => {
  return typeof value === 'string' ? value : fallback;
};

export const safeBoolean = (value: any, fallback: boolean = false): boolean => {
  return typeof value === 'boolean' ? value : fallback;
};

export const safeDate = (value: any, fallback: Date = new Date()): Date => {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return fallback;
};