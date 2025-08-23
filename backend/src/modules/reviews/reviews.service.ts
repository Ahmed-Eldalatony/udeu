import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class ReviewsService {
  // Mock data for now - replace with actual database operations
  private reviews = [
    {
      id: '1',
      userId: '1',
      courseId: '1',
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
      id: '2',
      userId: '2',
      courseId: '1',
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
  ];

  create(createReviewDto: CreateReviewDto, user: User) {
    const newReview = {
      id: (this.reviews.length + 1).toString(),
      userId: user.id,
      ...createReviewDto,
      isVisible: true,
      isVerified: false, // Would check if user purchased the course
      helpful: 0,
      unhelpful: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.reviews.push(newReview);
    return newReview;
  }

  findAll(query: any) {
    let filteredReviews = [...this.reviews];

    if (query.courseId) {
      filteredReviews = filteredReviews.filter(r => r.courseId === query.courseId);
    }

    if (query.userId) {
      filteredReviews = filteredReviews.filter(r => r.userId === query.userId);
    }

    if (query.minRating) {
      filteredReviews = filteredReviews.filter(r => r.rating >= parseInt(query.minRating));
    }

    if (query.isVisible !== undefined) {
      filteredReviews = filteredReviews.filter(r => r.isVisible === (query.isVisible === 'true'));
    }

    // Sorting
    if (query.sortBy) {
      filteredReviews.sort((a, b) => {
        let aValue = a[query.sortBy];
        let bValue = b[query.sortBy];

        if (query.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filteredReviews;
  }

  findByCourse(courseId: string) {
    return this.reviews.filter(review => review.courseId === courseId && review.isVisible);
  }

  findByUser(userId: string, requestingUser: User) {
    if (requestingUser.id !== userId) {
      throw new ForbiddenException('You can only view your own reviews');
    }
    return this.reviews.filter(review => review.userId === userId);
  }

  findOne(id: string) {
    const review = this.reviews.find(r => r.id === id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  update(id: string, updateReviewDto: UpdateReviewDto, user: User) {
    const reviewIndex = this.reviews.findIndex(r => r.id === id);
    if (reviewIndex === -1) {
      throw new NotFoundException('Review not found');
    }

    const review = this.reviews[reviewIndex];
    if (review.userId !== user.id) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    this.reviews[reviewIndex] = {
      ...review,
      ...updateReviewDto,
      updatedAt: new Date(),
    };

    return this.reviews[reviewIndex];
  }

  remove(id: string, user: User) {
    const reviewIndex = this.reviews.findIndex(r => r.id === id);
    if (reviewIndex === -1) {
      throw new NotFoundException('Review not found');
    }

    const review = this.reviews[reviewIndex];
    if (review.userId !== user.id) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const deletedReview = this.reviews[reviewIndex];
    this.reviews.splice(reviewIndex, 1);
    return deletedReview;
  }

  vote(id: string, type: 'helpful' | 'unhelpful', user: User) {
    const review = this.findOne(id);

    if (type === 'helpful') {
      review.helpful += 1;
    } else {
      review.unhelpful += 1;
    }

    review.updatedAt = new Date();
    return review;
  }

  getCourseStats(courseId: string) {
    const courseReviews = this.findByCourse(courseId);

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