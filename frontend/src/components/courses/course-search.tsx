import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface SearchFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  level?: string;
  minRating?: number;
  free?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

interface CourseSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
  initialFilters?: SearchFilters;
}

export const CourseSearch: React.FC<CourseSearchProps> = ({
  onSearch,
  onClearFilters,
  isLoading = false,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== undefined && value !== '' && value !== false
  );

  const activeFilterCount = Object.values(filters).filter(value =>
    value !== undefined && value !== '' && value !== false
  ).length;

  useEffect(() => {
    // Auto-search when filters change (debounced)
    const timeoutId = setTimeout(() => {
      if (Object.keys(filters).length > 0) {
        onSearch(filters);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters, onSearch]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search for courses..."
            value={filters.q || ''}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {isFiltersOpen && (
            <div className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Filter Options</CardTitle>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                        <X className="w-4 h-4 mr-1" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Category Filter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Input
                        placeholder="e.g., Web Development"
                        value={filters.category || ''}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                      />
                    </div>

                    {/* Level Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Difficulty Level</label>
                      <Select
                        value={filters.level || ''}
                        onValueChange={(value) => handleFilterChange('level', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any level</SelectItem>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="all_levels">All Levels</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Min Price ($)</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.minPrice || ''}
                        onChange={(e) => handleFilterChange('minPrice', parseFloat(e.target.value) || undefined)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Max Price ($)</label>
                      <Input
                        type="number"
                        placeholder="1000"
                        value={filters.maxPrice || ''}
                        onChange={(e) => handleFilterChange('maxPrice', parseFloat(e.target.value) || undefined)}
                      />
                    </div>
                  </div>

                  {/* Additional Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Rating Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Minimum Rating</label>
                      <Select
                        value={filters.minRating?.toString() || ''}
                        onValueChange={(value) => handleFilterChange('minRating', parseFloat(value) || undefined)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any rating</SelectItem>
                          <SelectItem value="4.5">4.5+ stars</SelectItem>
                          <SelectItem value="4.0">4.0+ stars</SelectItem>
                          <SelectItem value="3.5">3.5+ stars</SelectItem>
                          <SelectItem value="3.0">3.0+ stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Free Course Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Course Type</label>
                      <Select
                        value={filters.free?.toString() || ''}
                        onValueChange={(value) => handleFilterChange('free', value === 'true')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All courses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All courses</SelectItem>
                          <SelectItem value="true">Free only</SelectItem>
                          <SelectItem value="false">Paid only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort Options */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sort By</label>
                      <Select
                        value={filters.sortBy || ''}
                        onValueChange={(value) => handleFilterChange('sortBy', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Relevance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Relevance</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="price">Price: Low to High</SelectItem>
                          <SelectItem value="students">Most Popular</SelectItem>
                          <SelectItem value="createdAt">Newest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters.q && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{filters.q}"
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleFilterChange('q', undefined)}
                />
              </Badge>
            )}
            {filters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {filters.category}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleFilterChange('category', undefined)}
                />
              </Badge>
            )}
            {filters.level && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Level: {filters.level}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleFilterChange('level', undefined)}
                />
              </Badge>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Price: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => {
                    handleFilterChange('minPrice', undefined);
                    handleFilterChange('maxPrice', undefined);
                  }}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};