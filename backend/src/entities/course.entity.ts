import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  ALL_LEVELS = 'all_levels'
}

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
  ARCHIVED = 'archived'
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  shortDescription: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  previewVideoUrl: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'instructorId' })
  instructor: User;

  @Column()
  instructorId: string;

  @Column({ type: 'text', nullable: true })
  objectives: string; // JSON string of learning objectives

  @Column({ type: 'text', nullable: true })
  requirements: string; // JSON string of prerequisites

  @Column({ type: 'text', nullable: true })
  targetAudience: string; // JSON string of target audience

  @Column({
    type: 'enum',
    enum: CourseLevel,
    default: CourseLevel.ALL_LEVELS
  })
  level: CourseLevel;

  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.DRAFT
  })
  status: CourseStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salePrice: number;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  tags: string; // JSON string of tags

  @Column({ type: 'int', default: 0 })
  totalDuration: number; // in minutes

  @Column({ type: 'int', default: 0 })
  totalLectures: number;

  @Column({ type: 'int', default: 0 })
  totalStudents: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  totalReviews: number;

  @Column({ default: false })
  isFree: boolean;

  @Column({ default: true })
  isPublished: boolean;

  @Column({ nullable: true })
  publishedAt: Date;

  @Column({ type: 'text', nullable: true })
  welcomeMessage: string;

  @Column({ type: 'text', nullable: true })
  congratulationsMessage: string;

  @Column({ type: 'text', nullable: true })
  curriculum: string; // JSON string of course structure

  @Column({ type: 'text', nullable: true })
  faq: string; // JSON string of FAQ

  @Column({ type: 'text', nullable: true })
  seoTitle: string;

  @Column({ type: 'text', nullable: true })
  seoDescription: string;

  @Column({ type: 'text', nullable: true })
  metaKeywords: string;

  @Column({ default: true })
  allowComments: boolean;

  @Column({ default: false })
  featured: boolean;

  @Column({ type: 'int', default: 0 })
  popularityScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}