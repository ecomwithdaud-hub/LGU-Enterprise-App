import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class IssueBookDto {
  @ApiProperty({
    description: 'UUID v4 of the book to checkout',
    example: 'a4b86377-5120-4ee8-a53f-4229b46e3e1f',
  })
  @IsUUID('4', { message: 'bookId must be a valid UUID v4' })
  @IsNotEmpty({ message: 'bookId is required' })
  bookId: string;

  @ApiProperty({
    description: 'UUID v4 of the borrower (Student or Faculty)',
    example: 'c64a51eb-0cb3-4217-bf24-2c24ef84c71e',
  })
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  @IsNotEmpty({ message: 'userId is required' })
  userId: string;

  @ApiPropertyOptional({
    description: 'Loan duration in days (Default: 14 days)',
    default: 14,
    minimum: 1,
    maximum: 60,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(60)
  dueDays?: number = 14;
}
