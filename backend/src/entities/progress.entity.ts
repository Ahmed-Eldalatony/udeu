import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

export enum LectureType {
  VIDEO = 'video',
  TEXT = 'text',
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
  DOWNLOAD = 'download'
}

export enum ProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

@Entity('progress')
@Index(['userId', 'courseId']) // For efficient queries
@Index(['userId', 'courseId', 'lectureId'], { unique: true }) // Prevent duplicate progress entries
export class Progress {
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

  @Column()
  lectureId: string; // Reference to lecture/section

  @Column()
  lectureTitle: string;

  @Column({
    type: 'text',
    default: LectureType.VIDEO
  })
  lectureType: LectureType;

  @Column({
    type: 'text',
    default: ProgressStatus.NOT_STARTED
  })
  status: ProgressStatus;

  @Column({ type: 'int', default: 0 })
  watchTime: number; // in seconds

  @Column({ type: 'int', default: 0 })
  totalDuration: number; // in seconds

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  completionPercentage: number; // 0-100

  @Column({ default: 0 })
  attempts: number; // For quizzes/assignments

  @Column({ type: 'int', nullable: true })
  score: number; // For quizzes/assignments

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  lastAccessedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string; // Student notes for the lecture

  @Column({ default: false })
  isBookmarked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property for completion ratio
  get progressRatio(): number {
    return this.totalDuration > 0 ? this.watchTime / this.totalDuration : 0;
  }

  // Virtual property for completion status
  get isFullyCompleted(): boolean {
    return this.completionPercentage >= 100;
  }
}