import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { User } from '../../entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: User): Promise<Review> {
    const review = this.reviewsRepository.create({
      ...createReviewDto,
      userId: user.id,
      user,
      isVisible: true,
      isVerified: false, // Would check if user purchased the course
      helpful: 0,
      unhelpful: 0,
    });

    return this.reviewsRepository.save(review);
  }

  async findAll(query: any): Promise<Review[]> {
    const queryBuilder = this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.course', 'course');

    if (query.courseId) {
      queryBuilder.andWhere('review.courseId = :courseId', { courseId: query.courseId });
    }

    if (query.userId) {
      queryBuilder.andWhere('review.userId = :userId', { userId: query.userId });
    }

    if (query.minRating) {
      queryBuilder.andWhere('review.rating >= :minRating', { minRating: parseInt(query.minRating) });
    }

    if (query.isVisible !== undefined) {
      queryBuilder.andWhere('review.isVisible = :isVisible', { isVisible: query.isVisible === 'true' });
    }

    // Sorting
    if (query.sortBy) {
      const order = query.sortOrder === 'asc' ? 'ASC' : 'DESC';
      queryBuilder.orderBy(`review.${query.sortBy}`, order);
    } else {
      queryBuilder.orderBy('review.createdAt', 'DESC');
    }

    return queryBuilder.getMany();
  }

  async findByCourse(courseId: string): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: {
        courseId,
        isVisible: true,
      },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string, requestingUser: User): Promise<Review[]> {
    if (requestingUser.id !== userId) {
      throw new ForbiddenException('You can only view your own reviews');
    }

    return this.reviewsRepository.find({
      where: { userId },
      relations: ['course'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['user', 'course'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, user: User): Promise<Review> {
    const review = await this.findOne(id);

    if (review.userId !== user.id) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    Object.assign(review, updateReviewDto);
    return this.reviewsRepository.save(review);
  }

  async remove(id: string, user: User): Promise<Review> {
    const review = await this.findOne(id);

    if (review.userId !== user.id) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewsRepository.remove(review);
    return review;
  }

  async vote(id: string, type: 'helpful' | 'unhelpful', user: User): Promise<Review> {
    const review = await this.findOne(id);

    if (type === 'helpful') {
      review.helpful += 1;
    } else {
      review.unhelpful += 1;
    }

    return this.reviewsRepository.save(review);
  }

  async getCourseStats(courseId: string) {
    const courseReviews = await this.findByCourse(courseId);

    if (courseReviews.length === 0) {
      return {
        courseId,
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalRating = courseReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / courseReviews.length;

    const ratingDistribution = courseReviews.reduce((dist, review) => {
      dist[review.rating] = (dist[review.rating] || 0) + 1;
      return dist;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    return {
      courseId,
      totalReviews: courseReviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
    };
  }
}