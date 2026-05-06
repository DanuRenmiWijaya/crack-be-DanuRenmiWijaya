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
}
