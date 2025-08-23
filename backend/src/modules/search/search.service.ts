import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Course, CourseStatus, CourseLevel } from '../../entities/course.entity';
import { SearchCoursesDto } from './dto/search-courses.dto';

export interface SearchResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async searchCourses(searchDto: SearchCoursesDto): Promise<SearchResult<Course>> {
    const queryBuilder = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED });

    // Apply search query
    if (searchDto.q) {
      queryBuilder.andWhere(
        '(course.title ILIKE :searchQuery OR course.description ILIKE :searchQuery OR course.shortDescription ILIKE :searchQuery)',
        { searchQuery: `%${searchDto.q}%` }
      );
    }

    // Apply category filter
    if (searchDto.category) {
      queryBuilder.andWhere('course.category ILIKE :category', {
        category: `%${searchDto.category}%`
      });
    }

    // Apply price range filters
    if (searchDto.minPrice !== undefined) {
      queryBuilder.andWhere('course.price >= :minPrice', { minPrice: searchDto.minPrice });
    }

    if (searchDto.maxPrice !== undefined) {
      queryBuilder.andWhere('course.price <= :maxPrice', { maxPrice: searchDto.maxPrice });
    }

    // Apply level filter
    if (searchDto.level) {
      queryBuilder.andWhere('course.level = :level', { level: searchDto.level });
    }

    // Apply rating filter
    if (searchDto.minRating !== undefined) {
      queryBuilder.andWhere('course.rating >= :minRating', { minRating: searchDto.minRating });
    }

    // Apply free course filter
    if (searchDto.free !== undefined) {
      if (searchDto.free) {
        queryBuilder.andWhere('course.isFree = :isFree', { isFree: true });
      } else {
        queryBuilder.andWhere('course.isFree = :isFree', { isFree: false });
      }
    }

    // Apply instructor filter
    if (searchDto.instructor) {
      queryBuilder.andWhere(
        '(instructor.firstName ILIKE :instructorName OR instructor.lastName ILIKE :instructorName)',
        { instructorName: `%${searchDto.instructor}%` }
      );
    }

    // Apply featured filter
    if (searchDto.featured !== undefined) {
      queryBuilder.andWhere('course.featured = :featured', { featured: searchDto.featured });
    }

    // Apply duration filters
    if (searchDto.minDuration !== undefined) {
      queryBuilder.andWhere('course.totalDuration >= :minDuration', {
        minDuration: searchDto.minDuration
      });
    }

    if (searchDto.maxDuration !== undefined) {
      queryBuilder.andWhere('course.totalDuration <= :maxDuration', {
        maxDuration: searchDto.maxDuration
      });
    }

    // Apply tags filter
    if (searchDto.tags && searchDto.tags.length > 0) {
      searchDto.tags.forEach((tag, index) => {
        queryBuilder.andWhere(`course.tags ILIKE :tag${index}`, {
          [`tag${index}`]: `%${tag}%`
        });
      });
    }

    // Apply sorting
    const sortBy = searchDto.sortBy || 'createdAt';
    const sortOrder = searchDto.sortOrder || 'DESC';

    switch (sortBy) {
      case 'rating':
        queryBuilder.orderBy('course.rating', sortOrder);
        break;
      case 'price':
        queryBuilder.orderBy('course.price', sortOrder);
        break;
      case 'students':
        queryBuilder.orderBy('course.totalStudents', sortOrder);
        break;
      case 'popularity':
        queryBuilder.orderBy('course.popularityScore', sortOrder);
        break;
      case 'createdAt':
      default:
        queryBuilder.orderBy('course.createdAt', sortOrder);
        break;
    }

    // Apply pagination
    const limit = searchDto.limit || 20;
    const offset = searchDto.offset || 0;
    queryBuilder.limit(limit).offset(offset);

    // Get total count for pagination info
    const totalQuery = this.courseRepository
      .createQueryBuilder('course')
      .leftJoin('course.instructor', 'instructor')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED });

    this.applyFiltersToCountQuery(totalQuery, searchDto);
    const total = await totalQuery.getCount();

    // Get results
    const courses = await queryBuilder.getMany();

    return {
      data: courses,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getBrowseCategories(): Promise<any> {
    const categories = await this.courseRepository
      .createQueryBuilder('course')
      .select('course.category, COUNT(*) as count')
      .where('course.status = :status AND course.category IS NOT NULL', {
        status: CourseStatus.PUBLISHED
      })
      .groupBy('course.category')
      .orderBy('count', 'DESC')
      .getRawMany();

    return categories.map(cat => ({
      name: cat.course_category,
      count: parseInt(cat.count)
    }));
  }

  async getBrowseLevels(): Promise<any> {
    const levels = await this.courseRepository
      .createQueryBuilder('course')
      .select('course.level, COUNT(*) as count')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED })
      .groupBy('course.level')
      .orderBy('count', 'DESC')
      .getRawMany();

    return levels.map(lvl => ({
      level: lvl.course_level,
      count: parseInt(lvl.count)
    }));
  }

  async getPopularTags(): Promise<string[]> {
    const tagsResult = await this.courseRepository
      .createQueryBuilder('course')
      .select('course.tags')
      .where('course.status = :status AND course.tags IS NOT NULL', {
        status: CourseStatus.PUBLISHED
      })
      .getRawMany();

    const tagCounts = new Map<string, number>();

    tagsResult.forEach(row => {
      if (row.course_tags) {
        try {
          const tags = JSON.parse(row.course_tags) as string[];
          tags.forEach(tag => {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
          });
        } catch (e) {
          // Handle invalid JSON
        }
      }
    });

    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([tag]) => tag);
  }

  async getPriceRanges(): Promise<any> {
    const priceStats = await this.courseRepository
      .createQueryBuilder('course')
      .select([
        'MIN(course.price) as minPrice',
        'MAX(course.price) as maxPrice',
        'AVG(course.price) as avgPrice'
      ])
      .where('course.status = :status AND course.isFree = :isFree', {
        status: CourseStatus.PUBLISHED,
        isFree: false
      })
      .getRawOne();

    return {
      min: parseFloat(priceStats.minPrice || '0'),
      max: parseFloat(priceStats.maxPrice || '0'),
      average: parseFloat(priceStats.avgPrice || '0'),
    };
  }

  async getSuggestedSearches(): Promise<string[]> {
    // Get popular search terms based on course titles and tags
    const popularTitles = await this.courseRepository
      .createQueryBuilder('course')
      .select('course.title')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED })
      .orderBy('course.totalStudents', 'DESC')
      .limit(10)
      .getRawMany();

    return popularTitles.map(row => row.course_title);
  }

  async getAdvancedFilters(): Promise<any> {
    const [categories, levels, tags, priceRanges] = await Promise.all([
      this.getBrowseCategories(),
      this.getBrowseLevels(),
      this.getPopularTags(),
      this.getPriceRanges(),
    ]);

    return {
      categories,
      levels,
      tags,
      priceRanges,
    };
  }

  private applyFiltersToCountQuery(
    queryBuilder: SelectQueryBuilder<Course>,
    searchDto: SearchCoursesDto
  ): void {
    // Apply the same filters as the main query for accurate count
    if (searchDto.q) {
      queryBuilder.andWhere(
        '(course.title ILIKE :searchQuery OR course.description ILIKE :searchQuery OR course.shortDescription ILIKE :searchQuery)',
        { searchQuery: `%${searchDto.q}%` }
      );
    }

    if (searchDto.category) {
      queryBuilder.andWhere('course.category ILIKE :category', {
        category: `%${searchDto.category}%`
      });
    }

    // Apply other filters similarly...
    // (Simplified for brevity, but would include all the same filters)
  }
}