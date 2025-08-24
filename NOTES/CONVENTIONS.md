# Code Conventions & Standards

This document outlines the coding conventions, standards, and best practices for the Udemy Clone project. Following these guidelines ensures consistency, maintainability, and scalability across the entire codebase.

## 📁 Project Structure

### Overall Architecture

```
udeu/
├── backend/                    # NestJS API server
├── frontend/                   # React application
├── shared/                     # Shared types and utilities
└── docs/                       # Documentation
```

### Backend Structure (NestJS)

```
backend/src/
├── entities/                   # TypeORM entities
├── modules/                    # Feature modules
│   └── [module]/
│       ├── dto/               # Data Transfer Objects
│       ├── [module].controller.ts
│       ├── [module].service.ts
│       └── [module].module.ts
├── types/                      # Shared type definitions
└── app.module.ts               # Main application module
```

### Frontend Structure (React)

```
frontend/src/
├── components/                 # React components
│   ├── ui/                    # Reusable UI components
│   ├── pages/                 # Page components
│   └── [feature]/             # Feature-specific components
├── contexts/                  # React contexts
├── hooks/                     # Custom React hooks
├── lib/                       # Utilities and API clients
├── types/                     # TypeScript type definitions
└── App.tsx                    # Main application component
```

## 🏷️ Naming Conventions

### General Rules

- Use **camelCase** for variables, functions, and properties
- Use **PascalCase** for classes, interfaces, types, and components
- Use **SCREAMING_SNAKE_CASE** for constants
- Use **kebab-case** for file names and directories
- Use **descriptive, meaningful names** that clearly indicate purpose

### TypeScript Specific

```typescript
// ✅ Good
interface UserProfile {
  firstName: string;
  lastName: string;
  emailAddress: string;
}

const MAX_RETRY_ATTEMPTS = 3;

class UserService {
  async getUserById(userId: string): Promise<User> {
    // implementation
  }
}

// ❌ Avoid
interface userprofile {
  firstname: string;
  lastname: string;
  email: string;
}

const maxretryattempts = 3;

class userservice {
  async getuserbyid(userid: string): Promise<User> {
    // implementation
  }
}
```

### React Components

```typescript
// ✅ Good
// Component file: course-card.tsx
interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
  // implementation
};

// ❌ Avoid
// Component file: courseCard.js
interface courseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
}

export const courseCard = ({ course, onEnroll }) => {
  // implementation
};
```

### NestJS Specific

```typescript
// ✅ Good
// Controller: courses.controller.ts
@Controller("courses")
export class CoursesController {
  @Get()
  async findAllCourses(): Promise<Course[]> {
    // implementation
  }
}

// Service: courses.service.ts
@Injectable()
export class CoursesService {
  async findAll(): Promise<Course[]> {
    // implementation
  }
}

// ❌ Avoid
// Controller: courseController.ts
@Controller("courses")
export class courseController {
  @Get()
  async findallcourses(): Promise<Course[]> {
    // implementation
  }
}
```

## 📝 TypeScript Guidelines

### Type Definitions

- Always define explicit types for function parameters and return values
- Use interfaces for object shapes and DTOs
- Use type aliases for unions and complex types
- Avoid `any` type - use proper type definitions

```typescript
// ✅ Good
interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

type UserRole = "student" | "instructor" | "admin";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

// ❌ Avoid
interface createUserDto {
  email: any;
  password: any;
  firstName: any;
  lastName: any;
}

const userRole = "student" | "instructor" | "admin";
```

### Null vs Undefined

- Use `undefined` for optional properties and uninitialized variables
- Use `null` only when explicitly needed (e.g., database null values)
- Use optional chaining (`?.`) and nullish coalescing (`??`) operators

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  profilePicture?: string; // Optional property
}

const userName = user?.firstName ?? "Anonymous";

// ❌ Avoid
interface User {
  id: string;
  email: string;
  profilePicture: string | null; // Avoid null unions
}
```

### Enums

- Use string enums for better debugging and serialization
- Use PascalCase for enum names and values

```typescript
// ✅ Good
export enum CourseStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
  ARCHIVED = "archived",
}

export enum UserRole {
  STUDENT = "student",
  INSTRUCTOR = "instructor",
  ADMIN = "admin",
}

// ❌ Avoid
export enum courseStatus {
  draft = "draft",
  published = "published",
  unpublished = "unpublished",
  archived = "archived",
}
```

## ⚛️ React Conventions

### Component Structure

```typescript
// ✅ Good
import React, { useState, useEffect } from "react";
import { Course } from "../../types/shared";

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async () => {
    if (!onEnroll) return;

    setIsLoading(true);
    try {
      await onEnroll(course.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`course-card ${className}`}>
      <h3>{course.title}</h3>
      <button onClick={handleEnroll} disabled={isLoading}>
        {isLoading ? "Enrolling..." : "Enroll Now"}
      </button>
    </div>
  );
};
```

### Hooks

- Use custom hooks for reusable logic
- Follow naming convention: `use[Feature]`
- Handle loading and error states properly

```typescript
// ✅ Good
// hooks/useApi.ts
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = async <T>(
    request: () => Promise<ApiResponse<T>>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await request();
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || "Request failed");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, makeRequest };
};

// ❌ Avoid
// hooks/apiHook.js
export const apiHook = () => {
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState(null);
  // ...
};
```

### Context Usage

- Use context for global state management
- Provide proper TypeScript interfaces
- Include error boundaries

```typescript
// ✅ Good
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Implementation...

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## 🏗️ NestJS Conventions

### Module Structure

```typescript
// ✅ Good
// modules/courses/courses.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "../../entities/course.entity";
import { CoursesService } from "./courses.service";
import { CoursesController } from "./courses.controller";
import { UserModule } from "../users/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Course]), UserModule],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
```

### Controller Guidelines

- Use proper HTTP status codes
- Include error handling with try-catch blocks
- Use DTOs for request/response validation
- Implement proper authentication/authorization guards

```typescript
// ✅ Good
// modules/courses/courses.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { GetUser } from "../auth/get-user.decorator";
import { User } from "../../entities/user.entity";
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @GetUser() user: User
  ) {
    try {
      return await this.coursesService.create(createCourseDto, user);
    } catch (error) {
      throw new BadRequestException("Failed to create course");
    }
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.coursesService.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(id);
  }
}
```

### Service Guidelines

- Use dependency injection properly
- Implement business logic separation
- Handle database operations with TypeORM repositories
- Include proper error handling

```typescript
// ✅ Good
// modules/courses/courses.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Course } from "../../entities/course.entity";
import { User } from "../../entities/user.entity";
import { CreateCourseDto } from "./dto/create-course.dto";

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>
  ) {}

  async create(createCourseDto: CreateCourseDto, user: User): Promise<Course> {
    const course = this.coursesRepository.create({
      ...createCourseDto,
      instructorId: user.id,
      instructor: user,
    });

    return this.coursesRepository.save(course);
  }

  async findAll(query: any): Promise<Course[]> {
    const queryBuilder = this.coursesRepository
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.instructor", "instructor");

    // Apply filters
    if (query.category) {
      queryBuilder.andWhere("course.categoryId = :categoryId", {
        categoryId: query.category,
      });
    }

    if (query.level) {
      queryBuilder.andWhere("course.level = :level", { level: query.level });
    }

    // Apply sorting
    if (query.sortBy) {
      const order = query.sortOrder === "asc" ? "ASC" : "DESC";
      queryBuilder.orderBy(`course.${query.sortBy}`, order);
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ["instructor", "category"],
    });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    return course;
  }
}
```

## 🗄️ Database Conventions

### Entity Design

- Use UUIDs for primary keys (except for categories which can use auto-increment)
- Include createdAt and updatedAt timestamps
- Use proper foreign key relationships
- Implement soft deletes when appropriate

```typescript
// ✅ Good
// entities/course.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Category } from "./category.entity";

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "instructorId" })
  instructor: User;

  @Column()
  instructorId: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @Column()
  categoryId: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Repository Patterns

- Use TypeORM query builder for complex queries
- Include proper relations loading
- Implement pagination for large datasets
- Use transactions for complex operations

```typescript
// ✅ Good
async findCoursesWithFilters(query: any): Promise<[Course[], number]> {
  const queryBuilder = this.coursesRepository
    .createQueryBuilder('course')
    .leftJoinAndSelect('course.instructor', 'instructor')
    .leftJoinAndSelect('course.category', 'category');

  // Apply filters
  if (query.categoryId) {
    queryBuilder.andWhere('course.categoryId = :categoryId', {
      categoryId: query.categoryId
    });
  }

  if (query.priceMin) {
    queryBuilder.andWhere('course.price >= :priceMin', {
      priceMin: query.priceMin
    });
  }

  if (query.level) {
    queryBuilder.andWhere('course.level = :level', { level: query.level });
  }

  // Apply sorting
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 'ASC' : 'DESC';
  queryBuilder.orderBy(`course.${sortBy}`, sortOrder);

  // Apply pagination
  const page = query.page || 1;
  const limit = query.limit || 20;
  queryBuilder.skip((page - 1) * limit).take(limit);

  return queryBuilder.getManyAndCount();
}
```

## 📝 Error Handling

### Frontend Error Handling

```typescript
// ✅ Good
// lib/errorUtils.ts
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return "An unexpected error occurred";
};

// In components
const { loading, error, makeRequest } = useApi();

const handleSubmit = async (data: FormData) => {
  const result = await makeRequest(() => coursesAPI.create(data));

  if (result) {
    // Success
    toast({
      title: "Success",
      description: "Course created successfully",
    });
  } else {
    // Error is already handled by useApi hook
    console.error("Failed to create course");
  }
};
```

### Backend Error Handling

```typescript
// ✅ Good
// modules/courses/courses.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";

@Injectable()
export class CoursesService {
  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    user: User
  ): Promise<Course> {
    const course = await this.findOne(id);

    // Check permissions
    if (course.instructorId !== user.id) {
      throw new ForbiddenException("You can only update your own courses");
    }

    // Validate business rules
    if (updateCourseDto.price && updateCourseDto.price < 0) {
      throw new BadRequestException("Price cannot be negative");
    }

    try {
      Object.assign(course, updateCourseDto);
      return await this.coursesRepository.save(course);
    } catch (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        throw new BadRequestException("Course title must be unique");
      }
      throw error;
    }
  }
}
```

## 🎨 Styling Conventions

### CSS/Tailwind Classes

- Use Tailwind CSS utility classes
- Follow consistent spacing and sizing patterns
- Use design system tokens when available

```typescript
// ✅ Good
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
  <h3 className="text-lg font-semibold text-gray-900">Course Title</h3>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
    Enroll Now
  </button>
</div>

// ❌ Avoid
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
  <h3 className="text-lg font-semibold text-gray-900">Course Title</h3>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
    Enroll Now
  </button>
</div>
```

### Component Styling

- Use CSS modules or styled-components for component-specific styles
- Follow BEM methodology for CSS classes
- Maintain consistent color scheme and typography

## 📚 Documentation Standards

### Code Comments

- Use JSDoc comments for functions, classes, and interfaces
- Explain complex business logic
- Document API endpoints and DTOs

```typescript
// ✅ Good
/**
 * Creates a new course in the system
 * @param createCourseDto - Course creation data
 * @param user - The instructor creating the course
 * @returns Promise<Course> - The created course with populated relations
 * @throws BadRequestException if validation fails
 * @throws ForbiddenException if user lacks permissions
 */
async create(createCourseDto: CreateCourseDto, user: User): Promise<Course> {
  // Business logic implementation
}

// ❌ Avoid
async create(createCourseDto: CreateCourseDto, user: User): Promise<Course> {
  // Creates course
  // TODO: Add validation
}
```

### README Files

- Include setup instructions
- Document API endpoints
- Provide usage examples
- Include troubleshooting guides

## 🧪 Testing Conventions

### Unit Tests

```typescript
// ✅ Good
// modules/courses/courses.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CoursesService } from "./courses.service";
import { Course } from "../../entities/course.entity";

describe("CoursesService", () => {
  let service: CoursesService;
  let courseRepository: MockRepository<Course>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useClass: MockRepository,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    courseRepository = module.get(getRepositoryToken(Course));
  });

  it("should create a course", async () => {
    const createCourseDto: CreateCourseDto = {
      title: "Test Course",
      description: "Test Description",
      price: 49.99,
    };

    const expectedCourse = { id: "1", ...createCourseDto };
    courseRepository.create.mockReturnValue(expectedCourse);
    courseRepository.save.mockResolvedValue(expectedCourse);

    const result = await service.create(createCourseDto, mockUser);

    expect(result).toEqual(expectedCourse);
    expect(courseRepository.create).toHaveBeenCalledWith({
      ...createCourseDto,
      instructorId: mockUser.id,
    });
  });
});
```

## 🔧 Git Commit Conventions

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# ✅ Good
feat: Add course search with filters
fix: Resolve payment processing error
docs: Update API documentation
refactor: Extract common validation logic

# ❌ Avoid
added some features
bug fix
updated docs
```

## 🚀 Best Practices

### Performance

- Use React.memo for expensive components
- Implement proper pagination for large datasets
- Use lazy loading for routes and components
- Optimize images and bundle size

### Security

- Validate all user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Sanitize data before displaying to users

### Accessibility

- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation works
- Maintain proper color contrast ratios

### Code Quality

- Run linter before committing
- Write descriptive commit messages
- Keep functions small and focused
- Use meaningful variable names
- Follow the single responsibility principle

## 📋 Code Review Guidelines

### Pull Request Requirements

- Include descriptive title and description
- Reference related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Follow established conventions

### Review Checklist

- [ ] Code follows established conventions
- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented
- [ ] Tests are included/updated
- [ ] Documentation is updated
- [ ] Security considerations addressed
- [ ] Performance impact considered

---

## 📞 Need Help?

If you have questions about these conventions or need clarification:

1. Check existing code in the repository for examples
2. Ask in team discussions or pull request comments
3. Refer to the specific technology documentation (React, NestJS, TypeORM)
4. Look at similar patterns in the codebase

**Remember**: Consistency is key to maintainable code. When in doubt, follow the patterns established in the existing codebase.
