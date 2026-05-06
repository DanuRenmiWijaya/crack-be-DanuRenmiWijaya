import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsDateString, IsOptional } from 'class-validator';

export enum Gender {
  MALE = 'Laki-laki',
  FEMALE = 'Perempuan',
}

export class CreatePatientDto {
  @ApiProperty({ example: '3201010101010001', description: 'Nomor Induk Kependudukan' })
  @IsString()
  @IsNotEmpty()
  nik!: string;

  @ApiProperty({ example: 'Budi Santoso' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  gender!: Gender;

  @ApiProperty({ example: '1990-01-01', description: 'Format: YYYY-MM-DD' })
  @IsDateString()
  birthDate!: string;

  @ApiProperty({ example: 'Jl. Melati No. 123, Jakarta', required: false })
  @IsString()
  @IsOptional()
  address?: string;
}
