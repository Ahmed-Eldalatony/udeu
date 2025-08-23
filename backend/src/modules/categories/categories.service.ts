import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  // TODO: Implement with actual database operations
  // For now using mock data

  private categories = [
    {
      id: 1,
      name: 'Technology',
      description: 'Technology and programming courses',
      slug: 'technology',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Business',
      description: 'Business and entrepreneurship courses',
      slug: 'business',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: 'Design',
      description: 'Design and creative courses',
      slug: 'design',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  create(createCategoryDto: CreateCategoryDto) {
    const newCategory = {
      id: this.categories.length + 1,
      ...createCategoryDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  findAll() {
    return this.categories;
  }

  findOne(id: number) {
    return this.categories.find(category => category.id === id);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const index = this.categories.findIndex(category => category.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }

    this.categories[index] = {
      ...this.categories[index],
      ...updateCategoryDto,
      updatedAt: new Date(),
    };

    return this.categories[index];
  }

  remove(id: number) {
    const index = this.categories.findIndex(category => category.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }

    const deletedCategory = this.categories[index];
    this.categories.splice(index, 1);
    return deletedCategory;
  }

  getCategoryCourses(id: number) {
    // TODO: Implement actual course filtering by category
    return [];
  }

  getSubcategories(id: number) {
    return this.categories.filter(category => category.parentId === id);
  }
}