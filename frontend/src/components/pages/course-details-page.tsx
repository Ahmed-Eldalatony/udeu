import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { coursesAPI } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { Layout } from '../layout/layout';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { LoadingSpinner } from '../ui/loading-spinner';
import { ErrorMessage } from '../ui/error-message';
import { Star, Clock, Users, CheckCircle, ArrowLeft } from 'lucide-react';

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
    bio?: string;
  };
  featured: boolean;
  objectives?: string[];
  requirements?: string[];
  targetAudience?: string[];
}

export const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // API hooks for data fetching
  const {
    data: courseData,
    error: courseError,
    isLoading: loadingCourse,
    execute: loadCourse
  } = useApi<Course>(async (courseId: string) => {
    const response = await coursesAPI.getById(courseId);
    return { data: response.data as Course, error: response.error };
  });

  const {
    execute: enrollInCourse,
    isLoading: enrolling,
    error: enrollmentError
  } = useApi(async (courseId: string) => {
    const response = await coursesAPI.enroll(courseId);
    if (response.data) {
      setIsEnrolled(true);
    }
    return response;
  });

  // Load course data when component mounts or id changes
  useEffect(() => {
    if (id) {
      loadCourse(id);
    }
  }, [id, loadCourse]);

  // Update course state when API data arrives
  useEffect(() => {
    if (courseData) {
      setCourse(courseData);
    }
  }, [courseData]);

  const handleEnroll = async () => {
    if (course && user) {
      await enrollInCourse(course.id);
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loadingCourse) {
    return (
      <Layout>
        <LoadingSpinner size="lg" text="Loading course details..." />
      </Layout>
    );
  }

  if (courseError) {
    return (
      <Layout>
        <ErrorMessage
          title="Failed to load course"
          message={courseError || 'Unable to load course details'}
          onRetry={() => id && loadCourse(id)}
        />
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Link to="/courses">
            <Button>Browse All Courses</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/courses" className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Course Header */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {course.level}
                  </Badge>
                  {course.featured && (
                    <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                      Featured
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {course.title}
                </h1>

                <p className="text-lg text-gray-600 mb-4">
                  {course.shortDescription}
                </p>

                {/* Instructor Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {course.instructor.firstName[0]}{course.instructor.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {course.instructor.firstName} {course.instructor.lastName}
                      </p>
                      <p className="text-sm text-gray-600">Instructor</p>
                    </div>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.rating}</span>
                    <span>({course.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.totalStudents.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(course.totalDuration)} total</span>
                  </div>
                </div>
              </div>

              {/* Course Image */}
              {course.thumbnailUrl && (
                <div className="mb-8">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              )}

              {/* Course Description */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>About This Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {course.description}
                  </p>
                </CardContent>
              </Card>

              {/* What You'll Learn */}
              {course.objectives && course.objectives.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Target Audience */}
              {course.targetAudience && course.targetAudience.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Who This Course Is For</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.targetAudience.map((audience, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          <span>{audience}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {course.isFree ? 'Free' : formatPrice(course.price)}
                    </div>
                    {course.price > 0 && (
                      <div className="text-sm text-gray-600 line-through">
                        {formatPrice(course.price * 1.2)}
                      </div>
                    )}
                  </div>

                  {/* Enrollment Button */}
                  <Button
                    onClick={handleEnroll}
                    className="w-full mb-4"
                    disabled={isEnrolled || enrolling || !user}
                  >
                    {enrolling
                      ? 'Enrolling...'
                      : isEnrolled
                        ? 'Enrolled ✓'
                        : !user
                          ? 'Login to Enroll'
                          : course.isFree
                            ? 'Enroll Free'
                            : `Enroll for ${formatPrice(course.price)}`
                    }
                  </Button>

                  {/* Enrollment Error */}
                  {enrollmentError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                      {enrollmentError}
                    </div>
                  )}

                  {/* Course Includes */}
                  <div className="space-y-3 text-sm">
                    <h4 className="font-semibold text-gray-900">This course includes:</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Full lifetime access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Access on mobile and desktop</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Certificate of completion</span>
                      </li>
                    </ul>
                  </div>

                  {/* Tags */}
                  {course.tags && course.tags.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};