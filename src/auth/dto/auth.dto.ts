import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'admin_rs', description: 'Username untuk login' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'password123', description: 'Minimal 6 karakter' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'dr. Danu Wijaya', description: 'Nama lengkap dokter/admin' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'ADMIN', enum: ['ADMIN', 'DOCTOR'] })
  @IsString()
  @IsNotEmpty()
  role!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'admin_rs' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
