import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../../entities/course.entity';
import { Category } from '../../entities/category.entity';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { UserModule } from '../users/user.module';
import { CategoriesModule } from '../categories/categories.module';
import { EnrollmentModule } from '../enrollments/enrollment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Category]),
    UserModule,
    CategoriesModule,
    forwardRef(() => EnrollmentModule),
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}