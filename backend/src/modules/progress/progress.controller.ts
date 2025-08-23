import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../../entities/user.entity';
import { ProgressService } from './progress.service';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  findAll() {
    return this.progressService.findAll();
  }

  @Get('user')
  findByUser(@GetUser() user: User) {
    return this.progressService.findByUser(user.id);
  }

  @Get('user/:courseId')
  findByUserAndCourse(@GetUser() user: User, @Param('courseId') courseId: string) {
    return this.progressService.findByUserAndCourse(user.id, courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.progressService.findOne(id);
  }

  @Post()
  create(@Body() createProgressDto: any) {
    return this.progressService.create(createProgressDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProgressDto: any) {
    return this.progressService.update(id, updateProgressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.progressService.remove(id);
  }
}