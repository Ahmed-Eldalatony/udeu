import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod, Currency } from '../../entities/payment.entity';
import { User } from '../../entities/user.entity';
import { Course } from '../../entities/course.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, user: User): Promise<Payment> {
    const { courseId, amount, currency = Currency.USD, paymentMethod = PaymentMethod.STRIPE } = createPaymentDto;

    // Validate course exists and is published
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!course.isPublished) {
      throw new BadRequestException('Course is not available for purchase');
    }

    // Validate payment amount
    if (amount < course.price) {
      throw new BadRequestException('Payment amount is less than course price');
    }

    // Calculate fees and taxes (mock values)
    const fee = amount * 0.029; // 2.9% platform fee
    const tax = amount * 0.08; // 8% tax
    const netAmount = amount - fee - tax;

    // Create payment record
    const payment = this.paymentRepository.create({
      user,
      userId: user.id,
      course,
      courseId,
      amount,
      currency,
      paymentMethod,
      fee,
      tax,
      netAmount,
      description: createPaymentDto.description || `Payment for ${course.title}`,
      customerInfo: createPaymentDto.customerInfo,
      paymentMetadata: createPaymentDto.paymentMetadata,
      status: PaymentStatus.PENDING,
    });

    return this.paymentRepository.save(payment);
  }

  async processPayment(paymentId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['user', 'course'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment is not in pending status');
    }

    // Mock payment processing
    // In a real implementation, this would integrate with Stripe, PayPal, etc.
    const success = await this.mockPaymentProcessor(payment);

    if (success) {
      payment.status = PaymentStatus.COMPLETED;
      payment.transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      payment.paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      payment.invoiceUrl = `https://mock-invoice.com/${payment.id}`;
      payment.receiptUrl = `https://mock-receipt.com/${payment.id}`;
    } else {
      payment.status = PaymentStatus.FAILED;
      payment.errorDetails = {
        code: 'PAYMENT_FAILED',
        message: 'Payment processing failed - this is a mock error',
      };
    }

    return this.paymentRepository.save(payment);
  }

  async refundPayment(paymentId: string, reason?: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['user', 'course'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    if (payment.isRefunded) {
      throw new BadRequestException('Payment is already refunded');
    }

    // Mock refund processing
    const refundSuccess = await this.mockRefundProcessor(payment);

    if (refundSuccess) {
      payment.status = PaymentStatus.REFUNDED;
      payment.isRefunded = true;
      payment.refundedAmount = payment.amount;
      payment.refundedAt = new Date();
      payment.refundReason = reason || 'No reason provided';
    } else {
      throw new BadRequestException('Refund processing failed');
    }

    return this.paymentRepository.save(payment);
  }

  async findByUser(userId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { userId },
      relations: ['course'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCourse(courseId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { courseId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'course'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getPaymentStats(): Promise<any> {
    const totalPayments = await this.paymentRepository.count({
      where: { status: PaymentStatus.COMPLETED },
    });

    const totalRevenue = await this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .select('SUM(payment.amount)', 'total')
      .getRawOne();

    const monthlyRevenue = await this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .andWhere('payment.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)')
      .select('SUM(payment.amount)', 'total')
      .getRawOne();

    return {
      totalPayments,
      totalRevenue: parseFloat(totalRevenue?.total || '0'),
      monthlyRevenue: parseFloat(monthlyRevenue?.total || '0'),
    };
  }

  // Mock payment processor - simulates external payment gateway
  private async mockPaymentProcessor(payment: Payment): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock success rate - 95% success, 5% failure
    const random = Math.random();
    return random > 0.05;
  }

  // Mock refund processor
  private async mockRefundProcessor(payment: Payment): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock success rate - 98% success, 2% failure
    const random = Math.random();
    return random > 0.02;
  }
}