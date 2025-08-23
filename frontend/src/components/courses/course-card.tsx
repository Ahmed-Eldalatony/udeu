import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users, DollarSign } from 'lucide-react';

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

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  onViewDetails?: (courseId: string) => void;
  showEnrollButton?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  onViewDetails,
  showEnrollButton = true,
}) => {
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

  const getLevelColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-6xl text-blue-400">📚</div>
          </div>
        )}

        {course.featured && (
          <Badge className="absolute top-3 left-3 bg-yellow-500 text-white hover:bg-yellow-600">
            Featured
          </Badge>
        )}

        <Badge className={`absolute top-3 right-3 ${getLevelColor(course.level)}`}>
          {course.level}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold line-clamp-2 leading-tight">
            {course.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>by {course.instructor.firstName} {course.instructor.lastName}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.shortDescription || course.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({course.totalReviews})</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{course.totalStudents.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(course.totalDuration)}</span>
          </div>

          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">
              {course.isFree ? 'Free' : formatPrice(course.price)}
            </span>
          </div>
        </div>

        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {course.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {course.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{course.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t">
        <div className="flex gap-2 w-full">
          {showEnrollButton && (
            <Button
              onClick={() => onEnroll?.(course.id)}
              className="flex-1"
              disabled={course.isFree}
            >
              {course.isFree ? 'Enroll Free' : `Enroll for ${formatPrice(course.price)}`}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => onViewDetails?.(course.id)}
            className="flex-1"
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};