import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User, UserRole } from '../../entities/user.entity';

@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @GetUser() user: User) {
    return this.courseService.create(createCourseDto, user);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.courseService.findAll(query);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.courseService.search(query);
  }

  @Get('featured')
  getFeaturedCourses() {
    return this.courseService.getFeaturedCourses();
  }

  @Get('my-courses')
  @UseGuards(JwtAuthGuard)
  getMyCourses(@GetUser() user: User) {
    return this.courseService.findByInstructor(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.courseService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @GetUser() user: User,
  ) {
    return this.courseService.update(id, updateCourseDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.courseService.remove(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/publish')
  publish(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.courseService.publish(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/unpublish')
  unpublish(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.courseService.unpublish(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/enroll')
  enroll(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() enrollmentData: { amountPaid?: number; isFree?: boolean },
    @GetUser() user: User,
  ) {
    // TODO: Implement enrollment functionality
    return { message: 'Enrollment feature coming soon', courseId: id, userId: user.id };
  }

  @Get(':id/students')
  @UseGuards(JwtAuthGuard)
  getCourseStudents(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    // TODO: Implement student list for instructors
    return { message: 'Student list feature coming soon' };
  }
}