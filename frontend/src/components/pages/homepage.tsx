import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { Layout } from '../layout/layout';
import { SimpleCourseSearch } from '../courses/simple-search';
import { CourseGrid } from '../courses/course-grid';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { LoadingSpinner } from '../ui/loading-spinner';
import { ErrorMessage } from '../ui/error-message';
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';

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

export const Homepage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // API hooks for better error handling and loading states
  const {
    execute: searchCourses,
    error: searchError,
    isLoading: isSearching,
    reset: resetSearch
  } = useApi(coursesAPI.search);

  const {
    execute: loadCourses,
    error: loadError,
    isLoading: isLoadingCourses,
    reset: resetLoad
  } = useApi(coursesAPI.getAll);

  // Mock data for demonstration
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

  const handleSearch = async (filters: any) => {
    setSearchQuery(filters.q || '');

    if (filters.q) {
      // Use search API with useApi hook
      await searchCourses(filters.q);
    } else {
      // Get all courses when no search query
      await loadCourses({ limit: 20 });
    }
  };

  const handleEnroll = (courseId: string) => {
    console.log('Enrolling in course:', courseId);
    // TODO: Implement enrollment logic
  };

  const handleViewDetails = (courseId: string) => {
    console.log('Viewing course details:', courseId);
    // TODO: Navigate to course details page
  };

  useEffect(() => {
    // Load initial courses from API
    loadCourses({ limit: 20 });
  }, [loadCourses]);

  return (
    <Layout onSearch={handleSearch}>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn Without Limits
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Start, switch, or advance your career with more than 10,000 courses from
              the world's leading experts.
            </p>

            <div className="max-w-2xl mx-auto mb-8">
              <SimpleCourseSearch onSearch={handleSearch} isLoading={isSearching || isLoadingCourses} />
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span>Popular: React, Python, Marketing, Data Science</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">10,000+</div>
              <div className="text-sm text-gray-600">Courses</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">500K+</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">1,200+</div>
              <div className="text-sm text-gray-600">Instructors</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">4.7★</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Courses'}
              </h2>
              <p className="text-gray-600">
                {searchQuery
                  ? `${courses.length} courses found`
                  : 'Discover our most popular courses and start learning today'
                }
              </p>
            </div>

            {!searchQuery && (
              <Link to="/courses">
                <Button variant="outline">
                  View All Courses
                </Button>
              </Link>
            )}
          </div>

          <CourseGrid
            courses={courses}
            isLoading={isSearching || isLoadingCourses}
            onEnroll={handleEnroll}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Top Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Web Development', icon: '🌐', count: 1500 },
              { name: 'Data Science', icon: '📊', count: 800 },
              { name: 'Design', icon: '🎨', count: 600 },
              { name: 'Business', icon: '💼', count: 900 },
              { name: 'Marketing', icon: '📈', count: 700 },
              { name: 'Photography', icon: '📷', count: 400 },
            ].map((category) => (
              <Card key={category.name} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-600">{category.count} courses</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join millions of learners and start your journey today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Browse Courses
              </Button>
            </Link>
            <Link to="/instructor-dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Become an Instructor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};