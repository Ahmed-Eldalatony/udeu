// Backend DTO Types with Validation
import { IsEmail, IsEnum, IsString, IsOptional, MinLength, MaxLength, IsBoolean, IsDateString, IsNumber, Min, Max, IsUUID, IsUrl, IsArray, ArrayMinSize, IsPositive, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserRole, CourseLevel, CourseStatus, EnrollmentStatus, PaymentStatus, PaymentMethod, Currency, DeepPartial } from './shared';

// Authentication DTOs
export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100, { message: 'Password cannot exceed 100 characters' })
  password: string;

  @IsString({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsString({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid user role' })
  role?: UserRole;
}

export class RefreshTokenDto {
  @IsString({ message: 'Refresh token is required' })
  refreshToken: string;
}

// User DTOs
export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsString({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid user role' })
  role?: UserRole;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL for profile picture' })
  profilePicture?: string;

  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  @MaxLength(500, { message: 'Bio cannot exceed 500 characters' })
  bio?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;

  @IsOptional()
  @IsArray({ message: 'Skills must be an array of strings' })
  @ArrayMinSize(1, { message: 'At least one skill is required' })
  @IsString({ each: true, message: 'Each skill must be a string' })
  skills?: string[];

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL for website' })
  website?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid LinkedIn URL' })
  linkedin?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid GitHub URL' })
  github?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid Twitter URL' })
  twitter?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  lastName?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL for profile picture' })
  profilePicture?: string;

  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  @MaxLength(500, { message: 'Bio cannot exceed 500 characters' })
  bio?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;

  @IsOptional()
  @IsArray({ message: 'Skills must be an array of strings' })
  @IsString({ each: true, message: 'Each skill must be a string' })
  skills?: string[];

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL for website' })
  website?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid LinkedIn URL' })
  linkedin?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid GitHub URL' })
  github?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid Twitter URL' })
  twitter?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}

export class ChangePasswordDto {
  @IsString({ message: 'Current password is required' })
  currentPassword: string;

  @IsString({ message: 'New password is required' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @MaxLength(100, { message: 'New password cannot exceed 100 characters' })
  newPassword: string;
}

// Course DTOs
export class CreateCourseDto {
  @IsString({ message: 'Title is required' })
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsString({ message: 'Description is required' })
  @MinLength(50, { message: 'Description must be at least 50 characters long' })
  @MaxLength(5000, { message: 'Description cannot exceed 5000 characters' })
  description: string;

  @IsOptional()
  @IsString({ message: 'Short description must be a string' })
  @MaxLength(300, { message: 'Short description cannot exceed 300 characters' })
  shortDescription?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL for thumbnail' })
  thumbnailUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL for preview video' })
  previewVideoUrl?: string;

  @IsOptional()
  @IsArray({ message: 'Objectives must be an array of strings' })
  @ArrayMinSize(1, { message: 'At least one learning objective is required' })
  @IsString({ each: true, message: 'Each objective must be a string' })
  @MaxLength(200, { each: true, message: 'Each objective cannot exceed 200 characters' })
  objectives?: string[];

  @IsOptional()
  @IsArray({ message: 'Requirements must be an array of strings' })
  @IsString({ each: true, message: 'Each requirement must be a string' })
  @MaxLength(200, { each: true, message: 'Each requirement cannot exceed 200 characters' })
  requirements?: string[];

  @IsOptional()
  @IsArray({ message: 'Target audience must be an array of strings' })
  @IsString({ each: true, message: 'Each target audience item must be a string' })
  @MaxLength(200, { each: true, message: 'Each target audience item cannot exceed 200 characters' })
  targetAudience?: string[];

  @IsOptional()
  @IsEnum(CourseLevel, { message: 'Invalid course level' })
  level?: CourseLevel;

  @IsOptional()
  @IsEnum(CourseStatus, { message: 'Invalid course status' })
  status?: CourseStatus;

  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'Sale price must be a number' })
  @Min(0, { message: 'Sale price cannot be negative' })
  salePrice?: number;

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  @MaxLength(100, { message: 'Category cannot exceed 100 characters' })
  category?: string;

  @IsOptional()
  @IsArray({ message: 'Tags must be an array of strings' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @MaxLength(50, { each: true, message: 'Each tag cannot exceed 50 characters' })
  tags?: string[];
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  @Transform(({ value }) => value?.trim())
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MinLength(50, { message: 'Description must be at least 50 characters long' })
  @MaxLength(5000, { message: 'Description cannot exceed 5000 characters' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Short description must be a string' })
  @MaxLength(300, { message: 'Short description cannot exceed 300 characters' })
  shortDescription?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL for thumbnail' })
  thumbnailUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL for preview video' })
  previewVideoUrl?: string;

  @IsOptional()
  @IsArray({ message: 'Objectives must be an array of strings' })
  @IsString({ each: true, message: 'Each objective must be a string' })
  @MaxLength(200, { each: true, message: 'Each objective cannot exceed 200 characters' })
  objectives?: string[];

  @IsOptional()
  @IsArray({ message: 'Requirements must be an array of strings' })
  @IsString({ each: true, message: 'Each requirement must be a string' })
  @MaxLength(200, { each: true, message: 'Each requirement cannot exceed 200 characters' })
  requirements?: string[];

  @IsOptional()
  @IsArray({ message: 'Target audience must be an array of strings' })
  @IsString({ each: true, message: 'Each target audience item must be a string' })
  @MaxLength(200, { each: true, message: 'Each target audience item cannot exceed 200 characters' })
  targetAudience?: string[];

  @IsOptional()
  @IsEnum(CourseLevel, { message: 'Invalid course level' })
  level?: CourseLevel;

  @IsOptional()
  @IsEnum(CourseStatus, { message: 'Invalid course status' })
  status?: CourseStatus;

  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Sale price must be a number' })
  @Min(0, { message: 'Sale price cannot be negative' })
  salePrice?: number;

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  @MaxLength(100, { message: 'Category cannot exceed 100 characters' })
  category?: string;

  @IsOptional()
  @IsArray({ message: 'Tags must be an array of strings' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @MaxLength(50, { each: true, message: 'Each tag cannot exceed 50 characters' })
  tags?: string[];

  @IsOptional()
  @IsBoolean({ message: 'Featured must be a boolean' })
  featured?: boolean;
}

// Enrollment DTOs
export class CreateEnrollmentDto {
  @IsUUID('4', { message: 'Invalid course ID' })
  courseId: string;

  @IsOptional()
  @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(0, { message: 'Amount cannot be negative' })
  amount?: number;
}

export class UpdateEnrollmentDto {
  @IsOptional()
  @IsEnum(EnrollmentStatus, { message: 'Invalid enrollment status' })
  status?: EnrollmentStatus;

  @IsOptional()
  @IsNumber({}, { message: 'Progress percentage must be a number' })
  @Min(0, { message: 'Progress percentage cannot be negative' })
  @Max(100, { message: 'Progress percentage cannot exceed 100' })
  progressPercentage?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Completed lectures must be a number' })
  @Min(0, { message: 'Completed lectures cannot be negative' })
  completedLectures?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Total time watched must be a number' })
  @Min(0, { message: 'Total time watched cannot be negative' })
  totalTimeWatched?: number;

  @IsOptional()
  @IsArray({ message: 'Notes must be an array of strings' })
  @IsString({ each: true, message: 'Each note must be a string' })
  notes?: string[];

  @IsOptional()
  @IsArray({ message: 'Bookmarks must be an array of strings' })
  @IsString({ each: true, message: 'Each bookmark must be a string' })
  bookmarks?: string[];

  @IsOptional()
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating cannot exceed 5' })
  rating?: number;

  @IsOptional()
  @IsString({ message: 'Review must be a string' })
  @MaxLength(1000, { message: 'Review cannot exceed 1000 characters' })
  review?: string;
}

// Payment DTOs
export class CreatePaymentDto {
  @IsOptional()
  @IsUUID('4', { message: 'Invalid course ID' })
  courseId?: string;

  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(0.01, { message: 'Amount must be at least 0.01' })
  amount: number;

  @IsOptional()
  @IsEnum(Currency, { message: 'Invalid currency' })
  currency?: Currency;

  @IsOptional()
  @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Customer email is required' })
  @IsEmail({}, { message: 'Please provide a valid customer email' })
  customerEmail?: string;

  @IsOptional()
  @IsString({ message: 'Customer name is required' })
  @MinLength(2, { message: 'Customer name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Customer name cannot exceed 100 characters' })
  customerName?: string;
}

// Query DTOs
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 10;
}

export class CourseQueryDto extends PaginationDto {
  @IsOptional()
  @IsUUID('4', { message: 'Invalid instructor ID' })
  instructorId?: string;

  @IsOptional()
  @IsEnum(CourseLevel, { message: 'Invalid course level' })
  level?: CourseLevel;

  @IsOptional()
  @IsEnum(CourseStatus, { message: 'Invalid course status' })
  status?: CourseStatus;

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  @MaxLength(100, { message: 'Category cannot exceed 100 characters' })
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Minimum price must be a number' })
  @Min(0, { message: 'Minimum price cannot be negative' })
  priceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Maximum price must be a number' })
  @Min(0, { message: 'Maximum price cannot be negative' })
  priceMax?: number;

  @IsOptional()
  @IsBoolean({ message: 'isFree must be a boolean' })
  isFree?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isPublished must be a boolean' })
  isPublished?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Featured must be a boolean' })
  featured?: boolean;

  @IsOptional()
  @IsString({ message: 'Search query must be a string' })
  @MinLength(2, { message: 'Search query must be at least 2 characters long' })
  @MaxLength(100, { message: 'Search query cannot exceed 100 characters' })
  search?: string;

  @IsOptional()
  @IsIn(['price', 'rating', 'students', 'date'], { message: 'Invalid sort by field' })
  sortBy?: 'price' | 'rating' | 'students' | 'date';

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'Sort order must be asc or desc' })
  sortOrder?: 'asc' | 'desc';
}

// Response DTOs
export class ApiResponseDto<T = any> {
  @IsBoolean()
  success: boolean;

  @IsOptional()
  data?: T;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  error?: string;

  @IsNumber()
  statusCode: number;

  @IsOptional()
  @Type(() => Date)
  @IsDateString()
  timestamp?: string;
}

export class PaginatedResponseDto<T = any> extends ApiResponseDto<T[]> {
  @IsNumber()
  total: number;

  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;

  @IsNumber()
  totalPages: number;
}

// Validation Error DTOs
export class ValidationErrorDto {
  @IsString()
  field: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  code?: string;
}

export class ErrorResponseDto extends ApiResponseDto {
  @IsOptional()
  @IsArray()
  @Type(() => ValidationErrorDto)
  errors?: ValidationErrorDto[];

  @IsOptional()
  @IsString()
  path?: string;
}