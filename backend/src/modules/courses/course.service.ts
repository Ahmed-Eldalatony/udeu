import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course, CourseStatus } from '../../entities/course.entity';
import { User, UserRole } from '../../entities/user.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto, instructor: User): Promise<Course> {
    const course = this.courseRepository.create({
      ...createCourseDto,
      instructor,
      instructorId: instructor.id,
      objectives: JSON.stringify(createCourseDto.objectives || []),
      requirements: JSON.stringify(createCourseDto.requirements || []),
      targetAudience: JSON.stringify(createCourseDto.targetAudience || []),
      tags: JSON.stringify(createCourseDto.tags || []),
      status: createCourseDto.status || CourseStatus.DRAFT,
    });

    return this.courseRepository.save(course);
  }

  async findAll(query: any = {}): Promise<Course[]> {
    const { status, instructorId, category, level, featured, limit = 20, offset = 0 } = query;

    const whereClause: any = {};

    if (status) whereClause.status = status;
    if (instructorId) whereClause.instructorId = instructorId;
    if (category) whereClause.category = category;
    if (level) whereClause.level = level;
    if (featured !== undefined) whereClause.featured = featured;

    return this.courseRepository.find({
      where: whereClause,
      relations: ['instructor'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['instructor'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async findByInstructor(instructorId: string): Promise<Course[]> {
    return this.courseRepository.find({
      where: { instructorId },
      relations: ['instructor'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, user: User): Promise<Course> {
    const course = await this.findOne(id);

    // Check if user is the instructor or admin
    if (course.instructorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own courses');
    }

    // Convert arrays to JSON strings
    const updateData = { ...updateCourseDto };
    if (updateCourseDto.objectives) {
      updateData.objectives = JSON.stringify(updateCourseDto.objectives);
    }
    if (updateCourseDto.requirements) {
      updateData.requirements = JSON.stringify(updateCourseDto.requirements);
    }
    if (updateCourseDto.targetAudience) {
      updateData.targetAudience = JSON.stringify(updateCourseDto.targetAudience);
    }
    if (updateCourseDto.tags) {
      updateData.tags = JSON.stringify(updateCourseDto.tags);
    }

    Object.assign(course, updateData);
    return this.courseRepository.save(course);
  }

  async remove(id: string, user: User): Promise<void> {
    const course = await this.findOne(id);

    // Check if user is the instructor or admin
    if (course.instructorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    await this.courseRepository.remove(course);
  }

  async publish(id: string, user: User): Promise<Course> {
    const course = await this.findOne(id);

    // Check if user is the instructor or admin
    if (course.instructorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only publish your own courses');
    }

    course.status = CourseStatus.PUBLISHED;
    course.publishedAt = new Date();
    course.isPublished = true;

    return this.courseRepository.save(course);
  }

  async unpublish(id: string, user: User): Promise<Course> {
    const course = await this.findOne(id);

    // Check if user is the instructor or admin
    if (course.instructorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only unpublish your own courses');
    }

    course.status = CourseStatus.UNPUBLISHED;
    course.isPublished = false;

    return this.courseRepository.save(course);
  }

  async search(query: string): Promise<Course[]> {
    return this.courseRepository
      .createQueryBuilder('course')
      .where('course.title ILIKE :query OR course.description ILIKE :query', {
        query: `%${query}%`,
      })
      .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
      .leftJoinAndSelect('course.instructor', 'instructor')
      .getMany();
  }

  async getFeaturedCourses(): Promise<Course[]> {
    return this.courseRepository.find({
      where: {
        featured: true,
        status: CourseStatus.PUBLISHED,
      },
      relations: ['instructor'],
      take: 10,
      order: { popularityScore: 'DESC' },
    });
  }

  async incrementStudentCount(id: string): Promise<void> {
    await this.courseRepository.increment({ id }, 'totalStudents', 1);
  }

  async updateRating(id: string, newRating: number): Promise<void> {
    const course = await this.findOne(id);
    const currentTotalReviews = course.totalReviews;
    const currentRating = course.rating;

    const newTotalReviews = currentTotalReviews + 1;
    const updatedRating = ((currentRating * currentTotalReviews) + newRating) / newTotalReviews;

    await this.courseRepository.update(id, {
      rating: updatedRating,
      totalReviews: newTotalReviews,
    });
  }
}