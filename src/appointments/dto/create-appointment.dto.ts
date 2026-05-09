import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'Poli Umum' })
  @IsString()
  @IsNotEmpty()
  department!: string;

  @ApiProperty({ example: '2024-05-20' })
  @IsDateString()
  @IsNotEmpty()
  visitDate!: string;
}
