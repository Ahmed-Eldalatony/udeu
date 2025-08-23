import React from 'react';
import { CourseCard } from './course-card';

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

interface CourseGridProps {
  courses: Course[];
  isLoading?: boolean;
  onEnroll?: (courseId: string) => void;
  onViewDetails?: (courseId: string) => void;
  emptyMessage?: string;
}

export const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  isLoading = false,
  onEnroll,
  onViewDetails,
  emptyMessage = "No courses found matching your criteria.",
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
            <div className="space-y-2">
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              <div className="bg-gray-200 h-4 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onEnroll={onEnroll}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};