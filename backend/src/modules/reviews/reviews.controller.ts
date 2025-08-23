import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../../entities/user.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @GetUser() user: User) {
    return this.reviewsService.create(createReviewDto, user);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.reviewsService.findAll(query);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId', ParseUUIDPipe) courseId: string) {
    return this.reviewsService.findByCourse(courseId);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUser(@Param('userId', ParseUUIDPipe) userId: string, @GetUser() user: User) {
    return this.reviewsService.findByUser(userId, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @GetUser() user: User,
  ) {
    return this.reviewsService.update(id, updateReviewDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.reviewsService.remove(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  vote(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('type') type: 'helpful' | 'unhelpful',
    @GetUser() user: User,
  ) {
    return this.reviewsService.vote(id, type, user);
  }

  @Get('course/:courseId/stats')
  getCourseStats(@Param('courseId', ParseUUIDPipe) courseId: string) {
    return this.reviewsService.getCourseStats(courseId);
  }
}