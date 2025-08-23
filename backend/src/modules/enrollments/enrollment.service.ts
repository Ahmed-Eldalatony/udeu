import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment, EnrollmentStatus } from '../../entities/enrollment.entity';
import { Progress, ProgressStatus } from '../../entities/progress.entity';
import { User } from '../../entities/user.entity';
import { Course } from '../../entities/course.entity';
import { CourseService } from '../courses/course.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
    private courseService: CourseService,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto, user: User): Promise<Enrollment> {
    const { courseId, amountPaid = 0, isFree = false } = createEnrollmentDto;

    // Check if course exists and is published
    const course = await this.courseService.findOne(courseId);
    if (!course.isPublished) {
      throw new BadRequestException('Course is not available for enrollment');
    }

    // Check if user is already enrolled
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: { userId: user.id, courseId },
    });

    if (existingEnrollment) {
      throw new ConflictException('User is already enrolled in this course');
    }

    // Validate payment for paid courses
    if (!course.isFree && !isFree) {
      if (amountPaid < course.price) {
        throw new BadRequestException('Insufficient payment amount');
      }
    }

    // Create enrollment
    const enrollment = this.enrollmentRepository.create({
      user,
      userId: user.id,
      course,
      courseId,
      amountPaid: course.isFree ? 0 : amountPaid,
    });

    const savedEnrollment = await this.enrollmentRepository.save(enrollment);

    // Update course student count
    await this.courseService.incrementStudentCount(courseId);

    // Create initial progress entries for course lectures
    await this.createInitialProgress(user.id, courseId);

    return savedEnrollment;
  }

  async findAll(): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      relations: ['user', 'course'],
    });
  }

  async findByUser(userId: string): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { userId },
      relations: ['course', 'course.instructor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: ['user', 'course', 'course.instructor'],
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return enrollment;
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | null> {
    return this.enrollmentRepository.findOne({
      where: { userId, courseId },
      relations: ['course', 'course.instructor'],
    });
  }

  async updateProgress(userId: string, courseId: string, lectureId: string, watchTime: number): Promise<Progress> {
    // Check if user is enrolled
    const enrollment = await this.findByUserAndCourse(userId, courseId);
    if (!enrollment) {
      throw new BadRequestException('User is not enrolled in this course');
    }

    // Find or create progress entry
    let progress = await this.progressRepository.findOne({
      where: { userId, courseId, lectureId },
    });

    if (!progress) {
      progress = this.progressRepository.create({
        userId,
        courseId,
        lectureId,
        lectureTitle: 'Lecture Title', // TODO: Get from course structure
        watchTime: 0,
        totalDuration: 0, // TODO: Get from course structure
      });
    }

    // Update watch time
    progress.watchTime = Math.min(watchTime, progress.totalDuration);
    progress.completionPercentage = progress.totalDuration > 0
      ? (progress.watchTime / progress.totalDuration) * 100
      : 0;

    // Update status
    if (progress.completionPercentage >= 100) {
      progress.status = ProgressStatus.COMPLETED;
      progress.isCompleted = true;
      progress.completedAt = new Date();
    } else if (progress.watchTime > 0) {
      progress.status = ProgressStatus.IN_PROGRESS;
    }

    progress.lastAccessedAt = new Date();

    const savedProgress = await this.progressRepository.save(progress);

    // Update enrollment progress
    await this.updateEnrollmentProgress(userId, courseId);

    return savedProgress;
  }

  async getCourseProgress(userId: string, courseId: string): Promise<Progress[]> {
    return this.progressRepository.find({
      where: { userId, courseId },
      order: { createdAt: 'ASC' },
    });
  }

  async completeCourse(userId: string, courseId: string): Promise<Enrollment> {
    const enrollment = await this.findByUserAndCourse(userId, courseId);
    if (!enrollment) {
      throw new BadRequestException('User is not enrolled in this course');
    }

    enrollment.status = EnrollmentStatus.COMPLETED;
    enrollment.completedAt = new Date();
    enrollment.progressPercentage = 100;

    return this.enrollmentRepository.save(enrollment);
  }

  async dropCourse(userId: string, courseId: string): Promise<Enrollment> {
    const enrollment = await this.findByUserAndCourse(userId, courseId);
    if (!enrollment) {
      throw new BadRequestException('User is not enrolled in this course');
    }

    enrollment.status = EnrollmentStatus.DROPPED;

    return this.enrollmentRepository.save(enrollment);
  }

  private async createInitialProgress(userId: string, courseId: string): Promise<void> {
    // TODO: This would typically get the course structure/lectures
    // For now, we'll create a placeholder progress entry
    const progress = this.progressRepository.create({
      userId,
      courseId,
      lectureId: 'intro-lecture',
      lectureTitle: 'Introduction',
      status: ProgressStatus.NOT_STARTED,
      watchTime: 0,
      totalDuration: 0,
    });

    await this.progressRepository.save(progress);
  }

  private async updateEnrollmentProgress(userId: string, courseId: string): Promise<void> {
    const allProgress = await this.getCourseProgress(userId, courseId);

    if (allProgress.length === 0) return;

    const completedLectures = allProgress.filter(p => p.isCompleted).length;
    const totalWatchTime = allProgress.reduce((sum, p) => sum + p.watchTime, 0);
    const totalDuration = allProgress.reduce((sum, p) => sum + p.totalDuration, 0);

    const progressPercentage = totalDuration > 0
      ? (totalWatchTime / totalDuration) * 100
      : 0;

    await this.enrollmentRepository.update(
      { userId, courseId },
      {
        completedLectures,
        totalTimeWatched: totalWatchTime,
        progressPercentage,
        lastAccessedAt: new Date(),
      }
    );
  }
}