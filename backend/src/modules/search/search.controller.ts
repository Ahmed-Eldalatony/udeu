import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchCoursesDto } from './dto/search-courses.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('courses')
  searchCourses(
    @Query(ValidationPipe) searchDto: SearchCoursesDto,
  ) {
    return this.searchService.searchCourses(searchDto);
  }

  @Get('browse/categories')
  getBrowseCategories() {
    return this.searchService.getBrowseCategories();
  }

  @Get('browse/levels')
  getBrowseLevels() {
    return this.searchService.getBrowseLevels();
  }

  @Get('browse/tags')
  getPopularTags() {
    return this.searchService.getPopularTags();
  }

  @Get('browse/price-ranges')
  getPriceRanges() {
    return this.searchService.getPriceRanges();
  }

  @Get('suggestions')
  getSuggestedSearches() {
    return this.searchService.getSuggestedSearches();
  }

  @Get('filters')
  getAdvancedFilters() {
    return this.searchService.getAdvancedFilters();
  }

  @Get('quick-search')
  quickSearch(@Query('q') query: string) {
    // Simplified search for autocomplete/quick search
    const searchDto: SearchCoursesDto = {
      q: query,
      limit: 5,
      sortBy: 'popularity',
      sortOrder: 'DESC',
    };

    return this.searchService.searchCourses(searchDto);
  }
}