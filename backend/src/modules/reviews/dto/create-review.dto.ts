import { IsInt, IsString, IsOptional, IsArray, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  courseId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pros?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cons?: string[];
}