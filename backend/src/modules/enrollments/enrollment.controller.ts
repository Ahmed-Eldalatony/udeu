import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../../entities/user.entity';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto, @GetUser() user: User) {
    return this.enrollmentService.create(createEnrollmentDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@GetUser() user: User) {
    return this.enrollmentService.findByUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollmentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('course/:courseId')
  getEnrollmentByCourse(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @GetUser() user: User,
  ) {
    return this.enrollmentService.findByUserAndCourse(user.id, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('progress/:courseId/:lectureId')
  updateProgress(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Param('lectureId') lectureId: string,
    @Body('watchTime') watchTime: number,
    @GetUser() user: User,
  ) {
    return this.enrollmentService.updateProgress(user.id, courseId, lectureId, watchTime);
  }

  @UseGuards(JwtAuthGuard)
  @Get('progress/:courseId')
  getCourseProgress(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @GetUser() user: User,
  ) {
    return this.enrollmentService.getCourseProgress(user.id, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete/:courseId')
  completeCourse(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @GetUser() user: User,
  ) {
    return this.enrollmentService.completeCourse(user.id, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('drop/:courseId')
  dropCourse(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @GetUser() user: User,
  ) {
    return this.enrollmentService.dropCourse(user.id, courseId);
  }
}