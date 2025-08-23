import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  FREE = 'free'
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  CAD = 'CAD',
  AUD = 'AUD',
  INR = 'INR'
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Course, { nullable: true })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ nullable: true })
  courseId: string;

  @Column({
    type: 'text',
    default: PaymentStatus.PENDING
  })
  status: PaymentStatus;

  @Column({
    type: 'text',
    default: PaymentMethod.STRIPE
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'text',
    default: Currency.USD
  })
  currency: Currency;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fee: number; // Platform fee

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  netAmount: number; // Amount after fees and taxes

  @Column({ nullable: true })
  transactionId: string; // External payment processor ID

  @Column({ nullable: true })
  paymentIntentId: string; // Stripe payment intent ID

  @Column({ type: 'json', nullable: true })
  paymentMetadata: any; // Additional payment data

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  invoiceUrl: string;

  @Column({ nullable: true })
  receiptUrl: string;

  @Column({ default: false })
  isRefunded: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundedAmount: number;

  @Column({ nullable: true })
  refundedAt: Date;

  @Column({ type: 'text', nullable: true })
  refundReason: string;

  @Column({ default: false })
  isSubscription: boolean;

  @Column({ nullable: true })
  subscriptionId: string;

  @Column({ nullable: true })
  billingCycle: string; // monthly, yearly

  @Column({ type: 'json', nullable: true })
  customerInfo: any; // Billing address, card details (masked)

  @Column({ type: 'json', nullable: true })
  errorDetails: any; // Error information if payment failed

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property for payment success
  get isSuccessful(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  // Virtual property for full amount including fees
  get totalAmount(): number {
    return this.amount + this.fee + this.tax;
  }
}