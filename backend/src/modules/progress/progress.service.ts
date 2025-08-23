import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress, ProgressStatus } from '../../entities/progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
  ) {}

  async findAll(): Promise<Progress[]> {
    return this.progressRepository.find({
      relations: ['user', 'course'],
    });
  }

  async findOne(id: string): Promise<Progress> {
    const progress = await this.progressRepository.findOne({
      where: { id },
      relations: ['user', 'course'],
    });

    if (!progress) {
      throw new NotFoundException('Progress not found');
    }

    return progress;
  }

  async findByUser(userId: string): Promise<Progress[]> {
    return this.progressRepository.find({
      where: { userId },
      relations: ['course'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<Progress[]> {
    return this.progressRepository.find({
      where: { userId, courseId },
      order: { createdAt: 'ASC' },
    });
  }

  async create(progressData: Partial<Progress>): Promise<Progress> {
    const progress = this.progressRepository.create(progressData);
    return this.progressRepository.save(progress);
  }

  async update(id: string, progressData: Partial<Progress>): Promise<Progress> {
    const progress = await this.findOne(id);
    Object.assign(progress, progressData);
    return this.progressRepository.save(progress);
  }

  async remove(id: string): Promise<void> {
    const progress = await this.findOne(id);
    await this.progressRepository.remove(progress);
  }
}