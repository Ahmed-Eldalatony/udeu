import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  courseId: string;

  @IsOptional()
  @IsNumber()
  amountPaid?: number;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;
}