import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

export enum EnrollmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
  EXPIRED = 'expired'
}

@Entity('enrollments')
@Unique(['userId', 'courseId']) // Prevent duplicate enrollments
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: string;

  @Column({
    type: 'text',
    default: EnrollmentStatus.ACTIVE
  })
  status: EnrollmentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amountPaid: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progressPercentage: number; // 0-100

  @Column({ default: 0 })
  completedLectures: number;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  lastAccessedAt: Date;

  @Column({ type: 'int', default: 0 })
  totalTimeWatched: number; // in seconds

  @Column({ type: 'text', nullable: true })
  notes: string; // JSON string of student notes

  @Column({ type: 'text', nullable: true })
  bookmarks: string; // JSON string of bookmarked lectures

  @Column({ default: false })
  hasCertificate: boolean;

  @Column({ nullable: true })
  certificateUrl: string;

  @Column({ nullable: true })
  certificateIssuedAt: Date;

  @Column({ type: 'int', default: 0 })
  rating: number; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  review: string;

  @Column({ nullable: true })
  reviewedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property for completion status
  get isCompleted(): boolean {
    return this.status === EnrollmentStatus.COMPLETED;
  }

  // Virtual property for progress status
  get isInProgress(): boolean {
    return this.status === EnrollmentStatus.ACTIVE && this.progressPercentage < 100;
  }
}