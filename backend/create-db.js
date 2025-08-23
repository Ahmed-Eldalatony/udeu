const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("database.sqlite");

console.log("🗄️ Creating SQLite database...");

db.serialize(() => {
  // Create tables
  console.log("📋 Creating tables...");

  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS "user" (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      profilePicture TEXT,
      bio TEXT,
      role TEXT NOT NULL DEFAULT 'student',
      isActive BOOLEAN DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Courses table
  db.run(`
    CREATE TABLE IF NOT EXISTS course (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      shortDescription TEXT,
      thumbnailUrl TEXT,
      price DECIMAL(10,2) DEFAULT 0,
      isFree BOOLEAN DEFAULT 0,
      rating DECIMAL(3,2) DEFAULT 0,
      totalReviews INTEGER DEFAULT 0,
      totalStudents INTEGER DEFAULT 0,
      totalDuration INTEGER DEFAULT 0,
      level TEXT,
      category TEXT,
      tags TEXT,
      instructorId TEXT,
      isPublished BOOLEAN DEFAULT 0,
      featured BOOLEAN DEFAULT 0,
      requirements TEXT,
      whatYouWillLearn TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (instructorId) REFERENCES "user" (id)
    )
  `);

  // Enrollments table
  db.run(`
    CREATE TABLE IF NOT EXISTS enrollment (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      courseId TEXT NOT NULL,
      amountPaid DECIMAL(10,2) DEFAULT 0,
      status TEXT DEFAULT 'active',
      progressPercentage DECIMAL(5,2) DEFAULT 0,
      completedLectures INTEGER DEFAULT 0,
      totalTimeWatched INTEGER DEFAULT 0,
      lastAccessedAt DATETIME,
      completedAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES "user" (id),
      FOREIGN KEY (courseId) REFERENCES course (id),
      UNIQUE(userId, courseId)
    )
  `);

  // Progress table
  db.run(`
    CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      courseId TEXT NOT NULL,
      lectureId TEXT NOT NULL,
      lectureTitle TEXT,
      status TEXT DEFAULT 'not_started',
      watchTime INTEGER DEFAULT 0,
      totalDuration INTEGER DEFAULT 0,
      completionPercentage DECIMAL(5,2) DEFAULT 0,
      isCompleted BOOLEAN DEFAULT 0,
      completedAt DATETIME,
      lastAccessedAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES "user" (id),
      FOREIGN KEY (courseId) REFERENCES course (id),
      UNIQUE(userId, courseId, lectureId)
    )
  `);

  // Payments table
  db.run(`
    CREATE TABLE IF NOT EXISTS payment (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      courseId TEXT,
      amount DECIMAL(10,2) NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'completed',
      paymentMethod TEXT,
      transactionId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES "user" (id),
      FOREIGN KEY (courseId) REFERENCES course (id)
    )
  `);

  console.log("✅ Tables created successfully");

  // Seed data
  console.log("🌱 Seeding data...");

  // Hash password
  const hashedPassword = bcrypt.hashSync("password123", 10);

  // Generate UUID-like strings
  const generateId = () =>
    Math.random().toString(36).substring(2) + Date.now().toString(36);

  // Insert users
  const users = [
    [
      generateId(),
      "john.doe@email.com",
      hashedPassword,
      "John",
      "Doe",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      "Software developer and lifelong learner",
      "student",
      1,
    ],
    [
      generateId(),
      "jane.smith@email.com",
      hashedPassword,
      "Jane",
      "Smith",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      "Senior React Developer with 5+ years experience",
      "instructor",
      1,
    ],
    [
      generateId(),
      "mike.johnson@email.com",
      hashedPassword,
      "Mike",
      "Johnson",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      "Marketing professional looking to learn tech skills",
      "student",
      1,
    ],
  ];

  users.forEach((user) => {
    db.run(
      `INSERT OR IGNORE INTO "user" (id, email, password, firstName, lastName, profilePicture, bio, role, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      user
    );
  });

  console.log("✅ Users seeded successfully");
  console.log("\n🎉 Database creation completed successfully!");
  console.log("\n📊 Database Summary:");
  console.log("   👥 3 Users created");
  console.log("   📚 Ready for courses");
  console.log("   📝 Ready for enrollments");
  console.log("   📊 Ready for progress tracking");

  // Close database
  db.close((err) => {
    if (err) {
      console.error("❌ Error closing database:", err.message);
    } else {
      console.log("🔌 Database connection closed");
    }
  });
});
