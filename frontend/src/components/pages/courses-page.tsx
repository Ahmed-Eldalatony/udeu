import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../layout/layout';
import { SimpleCourseSearch } from '../courses/simple-search';
import { CourseGrid } from '../courses/course-grid';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Filter, X } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  price: number;
  isFree: boolean;
  rating: number;
  totalReviews: number;
  totalStudents: number;
  totalDuration: number;
  level: string;
  category: string;
  tags: string[];
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  featured: boolean;
}

export const CoursesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Get query parameters
  const searchQuery = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const level = searchParams.get('level') || '';
  const sortBy = searchParams.get('sortBy') || 'rating';

  // Mock courses data - in real app this would come from API
  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'Complete React Developer Course',
      description: 'Learn React from scratch and build modern web applications',
      shortDescription: 'Master React development with hands-on projects',
      thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      price: 99.99,
      isFree: false,
      rating: 4.8,
      totalReviews: 1250,
      totalStudents: 15000,
      totalDuration: 480,
      level: 'intermediate',
      category: 'Web Development',
      tags: ['React', 'JavaScript', 'Frontend'],
      instructor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
      },
      featured: true,
    },
    {
      id: '2',
      title: 'Python for Data Science',
      description: 'Comprehensive Python programming course for data analysis',
      shortDescription: 'Learn Python and data science fundamentals',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      price: 79.99,
      isFree: false,
      rating: 4.6,
      totalReviews: 890,
      totalStudents: 12000,
      totalDuration: 360,
      level: 'beginner',
      category: 'Data Science',
      tags: ['Python', 'Data Science', 'Analytics'],
      instructor: {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
      },
      featured: false,
    },
    {
      id: '3',
      title: 'Digital Marketing Mastery',
      description: 'Complete guide to digital marketing and online business',
      shortDescription: 'Grow your business with digital marketing strategies',
      thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      price: 89.99,
      isFree: false,
      rating: 4.7,
      totalReviews: 750,
      totalStudents: 8000,
      totalDuration: 240,
      level: 'intermediate',
      category: 'Business',
      tags: ['Marketing', 'SEO', 'Social Media'],
      instructor: {
        id: '3',
        firstName: 'Mike',
        lastName: 'Johnson',
      },
      featured: true,
    },
    {
      id: '4',
      title: 'Introduction to Machine Learning',
      description: 'Learn the fundamentals of machine learning and AI',
      shortDescription: 'Your journey into artificial intelligence starts here',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
      price: 0,
      isFree: true,
      rating: 4.9,
      totalReviews: 2100,
      totalStudents: 25000,
      totalDuration: 300,
      level: 'beginner',
      category: 'Artificial Intelligence',
      tags: ['Machine Learning', 'AI', 'Python'],
      instructor: {
        id: '4',
        firstName: 'Sarah',
        lastName: 'Wilson',
      },
      featured: false,
    },
  ];

  const handleSearch = (filters: any) => {
    setIsLoading(true);

    // Update URL parameters
    const newSearchParams = new URLSearchParams();
    if (filters.q) newSearchParams.set('q', filters.q);
    if (filters.category) newSearchParams.set('category', filters.category);
    if (filters.level) newSearchParams.set('level', filters.level);
    if (filters.sortBy) newSearchParams.set('sortBy', filters.sortBy);

    setSearchParams(newSearchParams);

    // Filter and sort courses
    let filteredCourses = mockCourses;

    if (filters.q) {
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(filters.q.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.q.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(filters.q.toLowerCase()))
      );
    }

    if (filters.category) {
      filteredCourses = filteredCourses.filter(course =>
        course.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.level) {
      filteredCourses = filteredCourses.filter(course =>
        course.level === filters.level
      );
    }

    // Sort courses
    filteredCourses.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'students':
          return b.totalStudents - a.totalStudents;
        case 'newest':
          return parseInt(b.id) - parseInt(a.id);
        default:
          return b.rating - a.rating;
      }
    });

    setTimeout(() => {
      setCourses(filteredCourses);
      setTotalResults(filteredCourses.length);
      setIsLoading(false);
    }, 500);
  };

  const handleEnroll = (courseId: string) => {
    console.log('Enrolling in course:', courseId);
    // TODO: Implement enrollment logic
  };

  const handleViewDetails = (courseId: string) => {
    console.log('Viewing course details:', courseId);
    // TODO: Navigate to course details page
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setCourses(mockCourses);
    setTotalResults(mockCourses.length);
  };

  useEffect(() => {
    // Initialize with current search parameters
    handleSearch({
      q: searchQuery,
      category,
      level,
      sortBy,
    });
  }, []);

  const activeFiltersCount = [searchQuery, category, level].filter(Boolean).length;

  return (
    <Layout onSearch={handleSearch}>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Courses'}
            </h1>
            <p className="text-gray-600">
              {totalResults} courses available
              {category && ` in ${category}`}
              {level && ` for ${level} level`}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <SimpleCourseSearch onSearch={handleSearch} isLoading={isLoading} />

            {activeFiltersCount > 0 && (
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm text-gray-600">Active filters:</span>
                </div>
                <div className="flex items-center gap-2">
                  {searchQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: "{searchQuery}"
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.delete('q');
                          setSearchParams(newParams);
                          handleSearch({ category, level, sortBy });
                        }}
                      />
                    </Badge>
                  )}
                  {category && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Category: {category}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.delete('category');
                          setSearchParams(newParams);
                          handleSearch({ q: searchQuery, level, sortBy });
                        }}
                      />
                    </Badge>
                  )}
                  {level && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Level: {level}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.delete('level');
                          setSearchParams(newParams);
                          handleSearch({ q: searchQuery, category, sortBy });
                        }}
                      />
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Sort Options */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('sortBy', e.target.value);
                    setSearchParams(newParams);
                    handleSearch({ q: searchQuery, category, level, sortBy: e.target.value });
                  }}
                  className="text-sm border border-gray-300 rounded px-3 py-1 bg-white"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="students">Most Popular</option>
                  <option value="price">Price: Low to High</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <CourseGrid
            courses={courses}
            isLoading={isLoading}
            onEnroll={handleEnroll}
            onViewDetails={handleViewDetails}
          />

          {/* Load More Button */}
          {courses.length > 0 && courses.length < totalResults && (
            <div className="mt-8 text-center">
              <Button variant="outline">
                Load More Courses
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};