import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, Matches, IsIn } from 'class-validator';

export class ReserveWorkstationDto {
  @ApiProperty({
    description: 'Identifier or UUID of the digital workstation / PC',
    example: 'WS-01',
  })
  @IsString()
  @IsNotEmpty({ message: 'workstationId is required' })
  workstationId: string;

  @ApiProperty({
    description: 'Reservation date in YYYY-MM-DD format',
    example: '2026-10-29',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must follow format YYYY-MM-DD' })
  date: string;

  @ApiProperty({
    description: 'Designated library lab session time slot',
    example: '10:00 - 12:00',
    enum: ['08:30 - 10:30', '10:30 - 12:30', '13:00 - 15:00', '15:00 - 17:00'],
  })
  @IsString()
  @IsIn(['08:30 - 10:30', '10:30 - 12:30', '13:00 - 15:00', '15:00 - 17:00'], {
    message: 'timeSlot must be one of the official library lab slots',
  })
  timeSlot: string;

  @ApiPropertyOptional({
    description: 'Academic research topic or purpose',
    example: 'Machine Learning Deep Neural Network Model Training',
  })
  @IsOptional()
  @IsString()
  purpose?: string;
}
