import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  level?: string;
  free?: boolean;
}

interface SimpleCourseSearchProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

export const SimpleCourseSearch: React.FC<SimpleCourseSearchProps> = ({
  onSearch,
  isLoading = false,
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch({ q: query.trim() || undefined });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2 max-w-2xl mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search for courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10"
        />
      </div>
      <Button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </Button>
    </div>
  );
};