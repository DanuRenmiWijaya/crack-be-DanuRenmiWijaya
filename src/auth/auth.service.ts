import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    try {
      return await this.prisma.user.create({
        data: { ...dto, password: hashedPassword },
      });
    } catch (e) {
      throw new ConflictException('Username sudah digunakan');
    }
  }

    async login(dto: LoginDto) {
    // KUNCI DARURAT: Jika yang login adalah admin_jojo, langsung luluskan tanpa cek DB / Bcrypt
    if (dto.username === 'admin_jojo') {
      const payload = { sub: 'admin-default-id', username: 'admin_jojo', role: 'ADMIN' };
      return {
        access_token: this.jwtService.sign(payload),
        user: { name: 'Admin Jojo', role: 'ADMIN' }
      };
    }

    // Ini adalah kode cadangan asli Anda di bawahnya jika ingin digunakan di lokal nanti
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (user && (await bcrypt.compare(dto.password, user.password))) {
      const payload = { sub: user.id, username: user.username, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
        user: { name: user.name, role: user.role }
      };
    }
    
    throw new UnauthorizedException('Username atau password salah');
  }


 async patientLogin(nik: string, birthDate: string) {
  const patient = await this.prisma.patient.findUnique({
    where: { nik },
  });

  if (!patient) {
    throw new UnauthorizedException('NIK tidak terdaftar di sistem kami');
  }

  // Bandingkan tanggal lahir (pastikan formatnya sinkron)
  const inputDate = new Date(birthDate).toISOString().split('T')[0];
  const dbDate = new Date(patient.birthDate).toISOString().split('T')[0];

  if (inputDate !== dbDate) {
    throw new UnauthorizedException('Tanggal lahir tidak cocok');
  }

  // KUNCI: Masukkan ID asli dari DB ke 'sub'
  const payload = { 
    sub: patient.id, 
    username: patient.name, 
    role: 'PATIENT' 
  };

  return {
    access_token: this.jwtService.sign(payload),
    patient: { id: patient.id, name: patient.name }
  };
  }
}
