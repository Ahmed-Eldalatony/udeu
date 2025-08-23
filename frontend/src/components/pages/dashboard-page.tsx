import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usersAPI, enrollmentsAPI } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { Layout } from '../layout/layout';
import { LoadingSpinner } from '../ui/loading-spinner';
import { ErrorMessage } from '../ui/error-message';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  User,
  BookOpen,
  Clock,
  Award,
  Settings,
  Edit,
  Calendar,
  Star
} from 'lucide-react';

interface Enrollment {
  id: string;
  courseId: string;
  status: string;
  amountPaid: number;
  progressPercentage: number;
  completedLectures: number;
  totalTimeWatched: number;
  course: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    rating: number;
    instructor: {
      firstName: string;
      lastName: string;
    };
  };
}

interface UserStats {
  totalEnrollments: number;
  completedCourses: number;
  totalHoursWatched: number;
  averageRating: number;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>({
    totalEnrollments: 0,
    completedCourses: 0,
    totalHoursWatched: 0,
    averageRating: 0,
  });

  // API hooks for data fetching
  const {
    data: enrollments,
    error: enrollmentsError,
    isLoading: loadingEnrollments,
    execute: loadEnrollments
  } = useApi<Enrollment[]>(async () => {
    const response = await enrollmentsAPI.getAll();
    return { data: response.data as Enrollment[], error: response.error };
  });

  const {
    data: userProfile,
    error: profileError,
    isLoading: loadingProfile,
    execute: loadProfile
  } = useApi(usersAPI.getProfile);

  // Load data on component mount
  useEffect(() => {
    if (user) {
      loadEnrollments();
      loadProfile();
      calculateStats();
    }
  }, [user, loadEnrollments, loadProfile]);

  // Calculate user statistics
  const calculateStats = () => {
    if (!enrollments) return;

    const totalEnrollments = enrollments.length;
    const completedCourses = enrollments.filter(e => e.status === 'completed').length;
    const totalHoursWatched = enrollments.reduce((sum, e) => sum + (e.totalTimeWatched / 3600), 0);
    const averageRating = enrollments.reduce((sum, e) => sum + (e.course?.rating || 0), 0) / totalEnrollments || 0;

    setUserStats({
      totalEnrollments,
      completedCourses,
      totalHoursWatched: Math.round(totalHoursWatched),
      averageRating: Math.round(averageRating * 10) / 10,
    });
  };

  // Update stats when enrollments change
  useEffect(() => {
    calculateStats();
  }, [enrollments]);

  if (loadingEnrollments || loadingProfile) {
    return (
      <Layout>
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </Layout>
    );
  }

  if (enrollmentsError || profileError) {
    return (
      <Layout>
        <ErrorMessage
          title="Failed to load dashboard"
          message={enrollmentsError || profileError || 'Unable to load your dashboard data'}
          onRetry={() => {
            loadEnrollments();
            loadProfile();
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-2">
                Here's an overview of your learning progress and enrolled courses.
              </p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.totalEnrollments}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.completedCourses}</p>
                </div>
                <Award className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hours Watched</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.totalHoursWatched}h</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.averageRating}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <Badge variant={user?.role === 'instructor' ? 'default' : 'secondary'} className="mt-1">
                      {user?.role}
                    </Badge>
                  </div>
                </div>

                {(user as any)?.bio && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                    <p className="text-gray-600 text-sm">{(user as any).bio}</p>
                  </div>
                )}

                <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  My Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrollments && enrollments.length > 0 ? (
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                      <div key={enrollment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                              {enrollment.course.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              by {enrollment.course.instructor.firstName} {enrollment.course.instructor.lastName}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Enrolled recently
                              </span>
                              <Badge variant={
                                enrollment.status === 'completed' ? 'default' :
                                  enrollment.status === 'active' ? 'secondary' : 'outline'
                              }>
                                {enrollment.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{enrollment.progressPercentage}%</span>
                          </div>
                          <Progress value={enrollment.progressPercentage} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{enrollment.completedLectures} lectures completed</span>
                            <span>{Math.round(enrollment.totalTimeWatched / 3600)}h watched</span>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button size="sm" className="flex-1">
                            Continue Learning
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course.</p>
                    <Button>Browse Courses</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Started new course</p>
                  <p className="text-sm text-gray-600">You enrolled in "React Development Bootcamp"</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Course completed</p>
                  <p className="text-sm text-gray-600">Congratulations on completing "JavaScript Fundamentals"!</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};