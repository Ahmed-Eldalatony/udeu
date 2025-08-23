import { DataSource } from 'typeorm';
import { User } from './src/entities/user.entity';
import { Course, CourseLevel, CourseStatus } from './src/entities/course.entity';
import { Category } from './src/entities/category.entity';
import { Review } from './src/entities/review.entity';
import { Enrollment, EnrollmentStatus } from './src/entities/enrollment.entity';
import { Payment } from './src/entities/payment.entity';
import { Progress } from './src/entities/progress.entity';
import { UserRole } from './src/types/shared';
const bcrypt = require('bcrypt');
import { randomUUID } from 'crypto';

async function seedDatabase() {
  console.log('🌱 Starting database seeding with TypeORM...');

  // Create TypeORM DataSource matching your app.module.ts configuration
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [User, Course, Category, Review, Enrollment, Payment, Progress],
    synchronize: true,
    logging: false,
  });

  try {
    // Initialize the DataSource
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await dataSource.getRepository(Progress).clear();
    await dataSource.getRepository(Payment).clear();
    await dataSource.getRepository(Enrollment).clear();
    await dataSource.getRepository(Review).clear();
    await dataSource.getRepository(Course).clear();
    await dataSource.getRepository(Category).clear();
    await dataSource.getRepository(User).clear();

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create users
    console.log('👥 Creating users...');
    const users: Partial<User>[] = [
      {
        id: randomUUID(),
        email: 'john.doe@email.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        bio: 'Software developer and lifelong learner',
        role: UserRole.STUDENT,
        isActive: true,
        isEmailVerified: false,
        isTwoFactorEnabled: false,
      },
      {
        id: randomUUID(),
        email: 'jane.smith@email.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        bio: 'Senior React Developer with 5+ years experience',
        role: UserRole.INSTRUCTOR,
        isActive: true,
        isEmailVerified: false,
        isTwoFactorEnabled: false,
      },
      {
        id: randomUUID(),
        email: 'mike.johnson@email.com',
        password: hashedPassword,
        firstName: 'Mike',
        lastName: 'Johnson',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        bio: 'Marketing professional looking to learn tech skills',
        role: UserRole.STUDENT,
        isActive: true,
        isEmailVerified: false,
        isTwoFactorEnabled: false,
      },
    ];

    // Save users
    const savedUsers = await dataSource.getRepository(User).save(users);
    console.log('✅ Users seeded successfully');

    // Create categories
    console.log('📂 Creating categories...');
    const categories: Partial<Category>[] = [
      {
        id: 1,
        name: 'Frontend Development',
        slug: 'frontend-development',
        description: 'Learn frontend web development technologies',
        parentId: undefined,
      },
      {
        id: 2,
        name: 'Backend Development',
        slug: 'backend-development',
        description: 'Master backend development and server-side technologies',
        parentId: undefined,
      },
      {
        id: 3,
        name: 'Programming Languages',
        slug: 'programming-languages',
        description: 'Learn various programming languages',
        parentId: undefined,
      },
      {
        id: 4,
        name: 'React',
        slug: 'react',
        description: 'React.js and related technologies',
        parentId: 1,
      },
      {
        id: 5,
        name: 'TypeScript',
        slug: 'typescript',
        description: 'TypeScript programming language',
        parentId: 3,
      },
    ];

    const savedCategories = await dataSource.getRepository(Category).save(categories);
    console.log('✅ Categories seeded successfully');

    // Create sample courses
    console.log('📚 Creating courses...');
    const instructor = savedUsers.find(u => u.role === UserRole.INSTRUCTOR)!;
    const frontendCategory = savedCategories.find(c => c.name === 'Frontend Development')!;
    const programmingCategory = savedCategories.find(c => c.name === 'Programming Languages')!;

    const courses: Partial<Course>[] = [
      {
        id: randomUUID(),
        title: 'React Fundamentals for Beginners',
        description: 'Learn the basics of React development from scratch. This comprehensive course covers components, state management, hooks, and building your first React applications.',
        shortDescription: 'Master React basics and build your first web applications',
        instructorId: instructor.id,
        instructor,
        price: 49.99,
        level: CourseLevel.BEGINNER,
        status: CourseStatus.PUBLISHED,
        totalDuration: 240, // 4 hours
        totalLectures: 25,
        totalStudents: 0,
        rating: 0,
        totalReviews: 0,
        isFree: false,
        isPublished: true,
        publishedAt: new Date(),
        category: frontendCategory,
        categoryId: frontendCategory.id,
        tags: JSON.stringify(['react', 'javascript', 'frontend', 'web-development']),
        objectives: JSON.stringify([
          'Understand React fundamentals',
          'Build reusable components',
          'Manage application state',
          'Deploy React applications'
        ]),
        requirements: JSON.stringify([
          'Basic JavaScript knowledge',
          'HTML and CSS fundamentals'
        ]),
        targetAudience: JSON.stringify([
          'Beginner developers',
          'Students learning web development',
          'Professionals switching to frontend development'
        ]),
        featured: true,
        popularityScore: 100,
      },
      {
        id: randomUUID(),
        title: 'Advanced TypeScript Patterns',
        description: 'Deep dive into advanced TypeScript patterns and best practices. Learn generics, decorators, utility types, and how to build type-safe applications.',
        shortDescription: 'Master advanced TypeScript patterns and type safety',
        instructorId: instructor.id,
        instructor,
        price: 79.99,
        level: CourseLevel.ADVANCED,
        status: CourseStatus.PUBLISHED,
        totalDuration: 360, // 6 hours
        totalLectures: 35,
        totalStudents: 0,
        rating: 0,
        totalReviews: 0,
        isFree: false,
        isPublished: true,
        publishedAt: new Date(),
        category: programmingCategory,
        categoryId: programmingCategory.id,
        tags: JSON.stringify(['typescript', 'javascript', 'type-safety', 'advanced-patterns']),
        objectives: JSON.stringify([
          'Master advanced TypeScript features',
          'Implement design patterns with TypeScript',
          'Build type-safe APIs',
          'Use advanced utility types effectively'
        ]),
        requirements: JSON.stringify([
          'Solid JavaScript knowledge',
          'Basic TypeScript understanding'
        ]),
        targetAudience: JSON.stringify([
          'Experienced JavaScript developers',
          'Developers working with large codebases',
          'Teams adopting TypeScript'
        ]),
        featured: false,
        popularityScore: 75,
      },
    ];

    // Save courses
    const savedCourses = await dataSource.getRepository(Course).save(courses);
    console.log('✅ Courses seeded successfully');

    // Create sample reviews
    console.log('⭐ Creating reviews...');
    const student1 = savedUsers.find(u => u.email === 'john.doe@email.com')!;
    const student2 = savedUsers.find(u => u.email === 'mike.johnson@email.com')!;
    const course1 = savedCourses[0];
    const course2 = savedCourses[1];

    const reviews: Partial<Review>[] = [
      {
        id: randomUUID(),
        userId: student1.id,
        user: student1,
        courseId: course1.id,
        course: course1,
        rating: 5,
        title: 'Excellent course!',
        comment: 'This course exceeded my expectations. The instructor was very knowledgeable and the content was well-structured.',
        pros: ['Clear explanations', 'Practical examples', 'Good pace'],
        cons: ['Some sections could be more detailed'],
        isVisible: true,
        isVerified: true,
        helpful: 12,
        unhelpful: 2,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: randomUUID(),
        userId: student2.id,
        user: student2,
        courseId: course1.id,
        course: course1,
        rating: 4,
        title: 'Great learning experience',
        comment: 'I learned a lot from this course. Would recommend to beginners.',
        pros: ['Beginner friendly', 'Good examples'],
        cons: ['Could use more advanced topics'],
        isVisible: true,
        isVerified: true,
        helpful: 8,
        unhelpful: 1,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        id: randomUUID(),
        userId: student1.id,
        user: student1,
        courseId: course2.id,
        course: course2,
        rating: 5,
        title: 'TypeScript mastery achieved',
        comment: 'This advanced TypeScript course was exactly what I needed. The patterns and best practices covered are invaluable.',
        pros: ['Deep technical content', 'Real-world examples', 'Expert instruction'],
        cons: ['Assumes prior TypeScript knowledge'],
        isVisible: true,
        isVerified: true,
        helpful: 15,
        unhelpful: 0,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25'),
      },
    ];

    await dataSource.getRepository(Review).save(reviews);
    console.log('✅ Reviews seeded successfully');

    // Create sample enrollments
    console.log('📝 Creating enrollments...');
    const student = savedUsers.find(u => u.email === 'john.doe@email.com')!;
    const course = savedCourses[0];

    const enrollments: Partial<Enrollment>[] = [
      {
        id: randomUUID(),
        userId: student.id,
        courseId: course.id,
        amountPaid: course.price,
        status: EnrollmentStatus.ACTIVE,
        progressPercentage: 25.5,
        completedLectures: 6,
        totalTimeWatched: 4800, // 80 minutes in seconds
        lastAccessedAt: new Date(),
      },
    ];

    await dataSource.getRepository(Enrollment).save(enrollments);
    console.log('✅ Enrollments seeded successfully');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Seeding Summary:');
    console.log(`   👥 ${savedUsers.length} Users created`);
    console.log(`   📂 ${savedCategories.length} Categories created`);
    console.log(`   📚 ${savedCourses.length} Courses created`);
    console.log(`   ⭐ ${reviews.length} Reviews created`);
    console.log(`   📝 ${enrollments.length} Enrollments created`);
    console.log('   💳 Ready for payments');
    console.log('   📊 Ready for progress tracking');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    // Close the DataSource
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the seeding function
seedDatabase()
  .then(() => {
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding process failed:', error);
    process.exit(1);
  });