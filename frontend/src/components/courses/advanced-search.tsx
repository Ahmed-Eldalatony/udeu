import React, { useState, useEffect } from 'react';
import { coursesAPI, categoriesAPI } from '../../lib/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import {
  Search,
  Filter,
  X,
  DollarSign,
  Clock,
  Star,
  Users,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Course } from '../../types/shared';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SearchFilters {
  query: string;
  category: string;
  level: string;
  priceMin: number;
  priceMax: number;
  durationMin: number;
  durationMax: number;
  ratingMin: number;
  sortBy: 'price' | 'rating' | 'duration' | 'students' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export const AdvancedSearch: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    level: '',
    priceMin: 0,
    priceMax: 200,
    durationMin: 0,
    durationMax: 500,
    ratingMin: 0,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    performSearch();
  }, [filters]);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const searchParams = {
        ...filters,
        limit: 20,
        offset: 0,
      };

      const response = await coursesAPI.getAll(searchParams);
      if (response.success && response.data) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      level: '',
      priceMin: 0,
      priceMax: 200,
      durationMin: 0,
      durationMax: 500,
      ratingMin: 0,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy' || key === 'sortOrder') return false;
    if (key === 'priceMin' || key === 'priceMax') return value !== (key === 'priceMin' ? 0 : 200);
    if (key === 'durationMin' || key === 'durationMax') return value !== (key === 'durationMin' ? 0 : 500);
    if (key === 'ratingMin') return value > 0;
    return value !== '';
  }).length;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search courses..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Advanced Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category and Level */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="level">Level</Label>
                <Select
                  value={filters.level}
                  onValueChange={(value) => handleFilterChange('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="all_levels">All Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Price Range: ${filters.priceMin} - ${filters.priceMax}
              </Label>
              <div className="mt-2">
                <Slider
                  value={[filters.priceMin, filters.priceMax]}
                  onValueChange={([min, max]) => {
                    handleFilterChange('priceMin', min);
                    handleFilterChange('priceMax', max);
                  }}
                  max={200}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>

            {/* Duration Range */}
            <div>
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Duration: {filters.durationMin} - {filters.durationMax} minutes
              </Label>
              <div className="mt-2">
                <Slider
                  value={[filters.durationMin, filters.durationMax]}
                  onValueChange={([min, max]) => {
                    handleFilterChange('durationMin', min);
                    handleFilterChange('durationMax', max);
                  }}
                  max={500}
                  min={0}
                  step={30}
                  className="w-full"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <Label className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Minimum Rating: {filters.ratingMin}+ stars
              </Label>
              <div className="mt-2">
                <Slider
                  value={[filters.ratingMin]}
                  onValueChange={([value]) => handleFilterChange('ratingMin', value)}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange('sortBy', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date Added</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Order</Label>
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value) => handleFilterChange('sortOrder', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">
                      <div className="flex items-center gap-2">
                        <SortDesc className="h-4 w-4" />
                        Descending
                      </div>
                    </SelectItem>
                    <SelectItem value="asc">
                      <div className="flex items-center gap-2">
                        <SortAsc className="h-4 w-4" />
                        Ascending
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {loading ? 'Searching...' : `${courses.length} courses found`}
          </h3>
          {activeFiltersCount > 0 && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No courses found matching your criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No thumbnail</span>
                    )}
                  </div>

                  <h4 className="font-semibold text-lg mb-2 line-clamp-2">
                    {course.title}
                  </h4>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Users className="h-4 w-4" />
                    {course.totalStudents} students
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Clock className="h-4 w-4" />
                    {Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{course.rating}</span>
                      <span className="text-sm text-gray-500">({course.totalReviews})</span>
                    </div>

                    <div className="text-right">
                      {course.isFree ? (
                        <span className="text-green-600 font-semibold">Free</span>
                      ) : (
                        <div>
                          <span className="font-semibold">${course.price}</span>
                          {course.salePrice && (
                            <span className="text-sm text-gray-500 ml-2 line-through">
                              ${course.salePrice}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {course.category && (
                    <Badge variant="secondary" className="mt-2">
                      {typeof course.category === 'string' ? course.category : course.category.name}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};