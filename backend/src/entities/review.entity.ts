import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity('reviews')
export class Review {
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

  @Column({ type: 'int' })
  rating: number; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ default: true })
  isVisible: boolean;

  @Column({ default: false })
  isVerified: boolean; // For verified purchases

  @Column({ type: 'json', nullable: true })
  pros: string[]; // What student liked

  @Column({ type: 'json', nullable: true })
  cons: string[]; // What could be improved

  @Column({ type: 'int', default: 0 })
  helpful: number; // Number of helpful votes

  @Column({ type: 'int', default: 0 })
  unhelpful: number; // Number of unhelpful votes

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}