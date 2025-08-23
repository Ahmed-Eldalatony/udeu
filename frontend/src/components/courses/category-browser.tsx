import React, { useState, useEffect } from 'react';
import { categoriesAPI, coursesAPI } from '../../lib/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Course } from '../../types/shared';
import {
  BookOpen,
  Users,
  Star,
  Clock,
  Search,
  Filter,
  Grid,
  List,
  ChevronRight
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  subcategories?: Category[];
}

interface CategoryBrowserProps {
  onCourseSelect?: (course: Course) => void;
}

export const CategoryBrowser: React.FC<CategoryBrowserProps> = ({ onCourseSelect }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryCourses, setCategoryCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryCourses(selectedCategory.id);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      if (response.success && response.data) {
        // Build hierarchical structure
        const topLevelCategories = response.data.filter(cat => !cat.parentId);
        const hierarchicalCategories = topLevelCategories.map(category => ({
          ...category,
          subcategories: response.data.filter(sub => sub.parentId === category.id)
        }));
        setCategories(hierarchicalCategories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryCourses = async (categoryId: number) => {
    try {
      setCoursesLoading(true);
      const response = await categoriesAPI.getCategoryCourses(categoryId.toString(), {
        limit: 50,
        sortBy: 'rating',
        sortOrder: 'desc'
      });
      if (response.success && response.data) {
        setCategoryCourses(response.data);
      }
    } catch (error) {
      console.error('Error loading category courses:', error);
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleCourseSelect = (course: Course) => {
    if (onCourseSelect) {
      onCourseSelect(course);
    }
  };

  const filteredCourses = categoryCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
          <p className="text-gray-600 mt-1">Discover courses in your area of interest</p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedCategory?.id === category.id
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:border-gray-300'
              }`}
            onClick={() => handleCategorySelect(category)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {category.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}

              {category.subcategories && category.subcategories.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Subcategories:</p>
                  <div className="flex flex-wrap gap-1">
                    {category.subcategories.slice(0, 3).map((sub) => (
                      <Badge key={sub.id} variant="secondary" className="text-xs">
                        {sub.name}
                      </Badge>
                    ))}
                    {category.subcategories.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{category.subcategories.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Category Courses */}
      {selectedCategory && (
        <div className="space-y-4">
          {/* Category Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedCategory.name} Courses
              </h3>
              <Badge variant="outline">
                {filteredCourses.length} courses
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search within category */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search in {selectedCategory.name}</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder={`Search ${selectedCategory.name.toLowerCase()} courses...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Courses Loading */}
          {coursesLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading courses...</p>
              </div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No courses found' : `No courses in ${selectedCategory.name}`}
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? `No courses match "${searchQuery}" in this category.`
                    : 'This category doesn\'t have any courses yet.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${viewMode === 'list' ? 'flex flex-row' : ''
                    }`}
                  onClick={() => handleCourseSelect(course)}
                >
                  <CardContent className={viewMode === 'list' ? 'flex-1 p-4' : 'p-4'}>
                    <div className={viewMode === 'list' ? 'flex gap-4' : ''}>
                      {/* Course Thumbnail */}
                      <div className={viewMode === 'list'
                        ? 'w-24 h-16 bg-gray-200 rounded flex-shrink-0'
                        : 'aspect-video bg-gray-200 rounded mb-3'
                      }>
                        {course.thumbnailUrl ? (
                          <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <BookOpen className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      {/* Course Info */}
                      <div className={viewMode === 'list' ? 'flex-1' : ''}>
                        <h4 className="font-semibold text-lg mb-2 line-clamp-2">
                          {course.title}
                        </h4>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{course.totalStudents}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{Math.floor(course.totalDuration / 60)}h</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            {course.isFree ? (
                              <span className="text-green-600 font-semibold">Free</span>
                            ) : (
                              <span className="font-semibold">${course.price}</span>
                            )}
                          </div>

                          {viewMode === 'list' && (
                            <Button variant="outline" size="sm">
                              View Course
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};