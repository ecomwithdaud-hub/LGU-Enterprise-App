import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class StudentParamDto {
  @ApiProperty({
    description: 'Target student user UUID',
    example: 'c64a51eb-0cb3-4217-bf24-2c24ef84c71e',
  })
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  @IsNotEmpty({ message: 'userId parameter is required' })
  userId: string;
}
