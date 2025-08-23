import { IsString, IsNumber, IsEnum, IsOptional, IsObject } from 'class-validator';
import { PaymentMethod, Currency } from '../../../entities/payment.entity';

export class CreatePaymentDto {
  @IsString()
  courseId: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  customerInfo?: any; // Billing address, contact info

  @IsOptional()
  @IsObject()
  paymentMetadata?: any; // Additional payment data
}