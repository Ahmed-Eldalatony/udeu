import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DataSource } from 'typeorm';
import { User, UserRole } from './src/entities/user.entity';
import { Course, CourseStatus, CourseLevel } from './src/entities/course.entity';
import { Category } from './src/entities/category.entity';
import { Enrollment, EnrollmentStatus } from './src/entities/enrollment.entity';
import { Review } from './src/entities/review.entity';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

async function seed() {
  console.log('🌱 Starting database seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await dataSource.query('PRAGMA foreign_keys = OFF');

    await dataSource.getRepository(Review).clear();
    await dataSource.getRepository(Enrollment).clear();
    await dataSource.getRepository(Course).clear();
    await dataSource.getRepository(Category).clear();
    await dataSource.getRepository(User).clear();

    await dataSource.query('PRAGMA foreign_keys = ON');

    console.log('✅ Existing data cleared');

    // Create categories (parent categories first, then children)
    console.log('📂 Creating categories...');

    // Create parent categories first
    const parentCategories = await Promise.all([
      dataSource.getRepository(Category).save({
        name: 'Web Development',
        description: 'Learn to build modern web applications',
        slug: 'web-development'
      }),
      dataSource.getRepository(Category).save({
        name: 'Mobile Development',
        description: 'Create mobile apps for iOS and Android',
        slug: 'mobile-development'
      }),
      dataSource.getRepository(Category).save({
        name: 'Data Science',
        description: 'Master data analysis and machine learning',
        slug: 'data-science'
      }),
      dataSource.getRepository(Category).save({
        name: 'Design',
        description: 'Graphic design, UI/UX, and creative skills',
        slug: 'design'
      }),
      dataSource.getRepository(Category).save({
        name: 'Business',
        description: 'Business skills, marketing, and entrepreneurship',
        slug: 'business'
      })
    ]);

    // Create child categories with correct parent IDs
    const javascriptCategory = await dataSource.getRepository(Category).save({
      name: 'JavaScript',
      description: 'JavaScript programming and frameworks',
      slug: 'javascript',
      parentId: parentCategories[0].id // Web Development
    });

    const childCategories = await Promise.all([
      javascriptCategory,
      dataSource.getRepository(Category).save({
        name: 'Python',
        description: 'Python programming and data analysis',
        slug: 'python',
        parentId: parentCategories[2].id // Data Science
      }),
      dataSource.getRepository(Category).save({
        name: 'React',
        description: 'React.js and modern frontend development',
        slug: 'react',
        parentId: javascriptCategory.id // JavaScript category ID
      })
    ]);

    const categories = [...parentCategories, ...childCategories];
    console.log('✅ Categories created');

    // Create users
    console.log('👥 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await Promise.all([
      // Admin user
      dataSource.getRepository(User).save({
        email: 'admin@udeu.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        bio: 'Platform administrator',
        isEmailVerified: true,
        isActive: true
      }),
      // Instructors
      dataSource.getRepository(User).save({
        email: 'john.doe@udeu.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.INSTRUCTOR,
        bio: 'Senior Full Stack Developer with 10+ years experience',
        description: 'Expert in React, Node.js, and cloud architecture',
        skills: JSON.stringify(['JavaScript', 'React', 'Node.js', 'AWS', 'TypeScript']),
        website: 'https://johndoe.dev',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        isEmailVerified: true,
        isActive: true
      }),
      dataSource.getRepository(User).save({
        email: 'sarah.smith@udeu.com',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Smith',
        role: UserRole.INSTRUCTOR,
        bio: 'Data Scientist and Machine Learning Engineer',
        description: 'PhD in Computer Science, specializing in AI and deep learning',
        skills: JSON.stringify(['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Statistics']),
        website: 'https://sarahsmith.ai',
        linkedin: 'https://linkedin.com/in/sarahsmith',
        github: 'https://github.com/sarahsmith',
        isEmailVerified: true,
        isActive: true
      }),
      dataSource.getRepository(User).save({
        email: 'mike.johnson@udeu.com',
        password: hashedPassword,
        firstName: 'Mike',
        lastName: 'Johnson',
        role: UserRole.INSTRUCTOR,
        bio: 'UI/UX Designer and Product Designer',
        description: 'Creating beautiful and functional user experiences',
        skills: JSON.stringify(['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research']),
        website: 'https://mikejohnson.design',
        linkedin: 'https://linkedin.com/in/mikejohnson',
        github: 'https://github.com/mikejohnson',
        isEmailVerified: true,
        isActive: true
      }),
      // Students
      dataSource.getRepository(User).save({
        email: 'student1@udeu.com',
        password: hashedPassword,
        firstName: 'Alice',
        lastName: 'Johnson',
        role: UserRole.STUDENT,
        bio: 'Aspiring web developer',
        isEmailVerified: true,
        isActive: true
      }),
      dataSource.getRepository(User).save({
        email: 'student2@udeu.com',
        password: hashedPassword,
        firstName: 'Bob',
        lastName: 'Wilson',
        role: UserRole.STUDENT,
        bio: 'Learning data science',
        isEmailVerified: true,
        isActive: true
      })
    ]);

    console.log('✅ Users created');

    // Create courses
    console.log('📚 Creating courses...');

    const instructor1 = users[1]; // John Doe
    const instructor2 = users[2]; // Sarah Smith
    const frontendCategory = categories[6]; // React category
    const dataScienceCategory = categories[6]; // Python category

    const courses = await Promise.all([
      dataSource.getRepository(Course).save({
        title: 'React Fundamentals for Beginners',
        description: 'Learn the basics of React development from scratch. This comprehensive course covers components, state management, hooks, and building your first React applications.',
        shortDescription: 'Master React basics and build your first web applications',
        instructorId: instructor1.id,
        price: 49.99,
        level: CourseLevel.BEGINNER,
        status: CourseStatus.PUBLISHED,
        totalDuration: 240,
        totalLectures: 25,
        totalStudents: 0,
        rating: 0,
        totalReviews: 0,
        isFree: false,
        isPublished: true,
        publishedAt: new Date(),
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
      }),
      dataSource.getRepository(Course).save({
        title: 'Advanced TypeScript Patterns',
        description: 'Deep dive into advanced TypeScript patterns and best practices. Learn generics, decorators, utility types, and how to build type-safe applications.',
        shortDescription: 'Master advanced TypeScript patterns and type safety',
        instructorId: instructor1.id,
        price: 79.99,
        level: CourseLevel.ADVANCED,
        status: CourseStatus.PUBLISHED,
        totalDuration: 360,
        totalLectures: 35,
        totalStudents: 0,
        rating: 0,
        totalReviews: 0,
        isFree: false,
        isPublished: true,
        publishedAt: new Date(),
        categoryId: frontendCategory.id,
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
      }),
      dataSource.getRepository(Course).save({
        title: 'Python for Data Science and Machine Learning',
        description: 'Comprehensive Python programming course for data analysis and machine learning. Learn pandas, numpy, scikit-learn, and build ML models.',
        shortDescription: 'Master Python for data science and machine learning',
        instructorId: instructor2.id,
        price: 89.99,
        level: CourseLevel.INTERMEDIATE,
        status: CourseStatus.PUBLISHED,
        totalDuration: 480,
        totalLectures: 45,
        totalStudents: 0,
        rating: 0,
        totalReviews: 0,
        isFree: false,
        isPublished: true,
        publishedAt: new Date(),
        categoryId: dataScienceCategory.id,
        tags: JSON.stringify(['python', 'data-science', 'machine-learning', 'pandas', 'numpy']),
        objectives: JSON.stringify([
          'Master Python programming',
          'Learn data analysis with pandas',
          'Build machine learning models',
          'Visualize data effectively'
        ]),
        requirements: JSON.stringify([
          'Basic programming knowledge',
          'Mathematics fundamentals'
        ]),
        targetAudience: JSON.stringify([
          'Aspiring data scientists',
          'Python developers',
          'Business analysts',
          'Students interested in AI'
        ]),
        featured: true,
        popularityScore: 90,
      })
    ]);

    console.log('✅ Courses created');

    // Create sample reviews
    console.log('⭐ Creating reviews...');
    const student1 = users[4]; // Alice Johnson
    const student2 = users[5]; // Bob Wilson
    const course1 = courses[0];
    const course2 = courses[1];
    const course3 = courses[2];

    const reviews = await Promise.all([
      dataSource.getRepository(Review).save({
        userId: student1.id,
        courseId: course1.id,
        rating: 5,
        title: 'Excellent course!',
        comment: 'This course exceeded my expectations. The instructor was very knowledgeable and the content was well-structured.',
        pros: ['Clear explanations', 'Practical examples', 'Good pace'],
        cons: ['Some sections could be more detailed'],
        isVisible: true,
        isVerified: true,
        helpful: 12,
        unhelpful: 2,
      }),
      dataSource.getRepository(Review).save({
        userId: student2.id,
        courseId: course1.id,
        rating: 4,
        title: 'Great learning experience',
        comment: 'I learned a lot from this course. Would recommend to beginners.',
        pros: ['Beginner friendly', 'Good examples'],
        cons: ['Could use more advanced topics'],
        isVisible: true,
        isVerified: true,
        helpful: 8,
        unhelpful: 1,
      }),
      dataSource.getRepository(Review).save({
        userId: student1.id,
        courseId: course2.id,
        rating: 5,
        title: 'TypeScript mastery achieved',
        comment: 'This advanced TypeScript course was exactly what I needed. The patterns and best practices covered are invaluable.',
        pros: ['Deep technical content', 'Real-world examples', 'Expert instruction'],
        cons: ['Assumes prior TypeScript knowledge'],
        isVisible: true,
        isVerified: true,
        helpful: 15,
        unhelpful: 0,
      }),
      dataSource.getRepository(Review).save({
        userId: student2.id,
        courseId: course3.id,
        rating: 5,
        title: 'Perfect for data science beginners',
        comment: 'Excellent introduction to Python for data science. The instructor explains complex concepts clearly.',
        pros: ['Well-structured content', 'Clear explanations', 'Practical examples'],
        cons: ['Could include more real datasets'],
        isVisible: true,
        isVerified: true,
        helpful: 20,
        unhelpful: 1,
      })
    ]);

    console.log('✅ Reviews created');

    // Create sample enrollments
    console.log('📝 Creating enrollments...');
    const enrollments = await Promise.all([
      dataSource.getRepository(Enrollment).save({
        userId: student1.id,
        courseId: course1.id,
        amountPaid: course1.price,
        status: EnrollmentStatus.ACTIVE,
        progressPercentage: 25.5,
        completedLectures: 6,
        totalTimeWatched: 4800,
        lastAccessedAt: new Date(),
      }),
      dataSource.getRepository(Enrollment).save({
        userId: student2.id,
        courseId: course3.id,
        amountPaid: course3.price,
        status: EnrollmentStatus.COMPLETED,
        progressPercentage: 100,
        completedLectures: 45,
        totalTimeWatched: 14400,
        lastAccessedAt: new Date(),
        completedAt: new Date(),
      })
    ]);

    console.log('✅ Enrollments created');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Seeding Summary:');
    console.log(`   👥 ${users.length} Users created`);
    console.log(`   📂 ${categories.length} Categories created`);
    console.log(`   📚 ${courses.length} Courses created`);
    console.log(`   ⭐ ${reviews.length} Reviews created`);
    console.log(`   📝 ${enrollments.length} Enrollments created`);
    console.log('   💳 Ready for payments');
    console.log('   📊 Ready for progress tracking');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await app.close();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the seeding function
seed()
  .then(() => {
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding process failed:', error);
    process.exit(1);
  });