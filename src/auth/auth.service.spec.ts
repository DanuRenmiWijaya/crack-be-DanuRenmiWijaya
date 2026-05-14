import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    patient: {
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_jwt_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const dto = { username: 'doctor1', password: 'password123', name: 'Dr. John', role: 'DOCTOR' };
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({ id: 'user-1', ...dto });

      const result = await service.register(dto);
      expect(result).toBeDefined();
      expect(result.id).toBe('user-1');
    });

    it('should throw ConflictException if username exists', async () => {
      const dto = { username: 'doctor1', password: 'password123', name: 'Dr. John', role: 'DOCTOR' };
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'existing-id' });
      
      mockPrismaService.user.create.mockImplementationOnce(() => {
        throw new ConflictException('Username sudah terdaftar');
      });

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return an access token upon successful login', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        username: 'admin',
        password: hashedPassword,
        name: 'Admin RS',
        role: 'ADMIN',
      });

      const result = await service.login({ username: 'admin', password: 'password123' });
      expect(result).toHaveProperty('access_token');
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        username: 'admin',
        password: 'wrong_hashed_password',
      });

      await expect(
        service.login({ username: 'admin', password: 'password123' })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('patientLogin', () => {
    it('should login patient and return access token if NIK exists', async () => {
      mockPrismaService.patient.findUnique.mockResolvedValue({
        id: 'patient-123',
        nik: '3201020304050607',
        name: 'Mariadi',
        birthDate: new Date('2026-05-12'), 
      });

      const result = await service.patientLogin('3201020304050607', '2026-05-12');
      expect(result).toHaveProperty('access_token');
    });

    it('should throw UnauthorizedException if patient NIK is not found', async () => {
      mockPrismaService.patient.findUnique.mockResolvedValue(null);

      await expect(service.patientLogin('1111111111111111', '2026-05-12')).rejects.toThrow(UnauthorizedException);
    });
  });
});