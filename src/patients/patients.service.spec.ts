import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';
import { PrismaService } from '../prisma/prisma.service';
import { Gender } from './dto/create-patient.dto';

describe('PatientsService', () => {
  let service: PatientsService;
  let prisma: PrismaService;

  // Mocking Prisma Service dengan fungsi CRUD lengkap
  const mockPrismaService = {
    patient: {
      count: jest.fn().mockResolvedValue(5), 
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn().mockResolvedValue([{ id: 'patient-1', name: 'Andi' }]),
      update: jest.fn(),
      delete: jest.fn(),
    },
    medicalRecord: {
      count: jest.fn().mockResolvedValue(3),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 1. Test Statistik Harian (Bawaan)
  it('should calculate today statistics correctly', async () => {
    const stats = await service.getTodayStats();
    expect(stats).toEqual({ newPatients: 5, totalVisits: 3 });
    expect(prisma.patient.count).toHaveBeenCalled();
    expect(prisma.medicalRecord.count).toHaveBeenCalled();
  });

  // 2. Test Create Pasien Baru (Sukses)
  it('should successfully create a new patient', async () => {
    const dto = { nik: '1234567890123456', name: 'Andi', gender: 'Laki-laki', birthDate: '2000-01-01', address: 'Semarang' } as any;
    mockPrismaService.patient.findUnique.mockResolvedValue(null); // Simulasi NIK belum ada
    mockPrismaService.patient.create.mockResolvedValue({ id: 'patient-1', ...dto });

    const result = await service.create(dto);
    expect(result).toBeDefined();
    expect(result.id).toBe('patient-1');
    expect(prisma.patient.create).toHaveBeenCalled();
  });

  // 3. Test Create Pasien (Gagal karena NIK Duplikat)
  it('should throw ConflictException if NIK already exists', async () => {
    const dto = { nik: '1234567890123456', name: 'Andi', gender: 'Laki-laki', birthDate: '2000-01-01', address: 'Semarang' } as any;
    mockPrismaService.patient.findUnique.mockResolvedValue({ id: 'existing-patient-id' }); // Simulasi NIK sudah ada

    await expect(service.create(dto)).rejects.toThrow();
  });

  // 4. Test Find All Pasien
  it('should return all patients', async () => {
    const result = await service.findAll();
    expect(result).toEqual([{ id: 'patient-1', name: 'Andi' }]);
    expect(prisma.patient.findMany).toHaveBeenCalled();
  });

  // 5. Test Find One Pasien berdasarkan ID
  it('should return a single patient by ID', async () => {
    mockPrismaService.patient.findUnique.mockResolvedValue({ id: 'patient-1', name: 'Andi' });
    
    const result = await service.findOne('patient-1');
    expect(result).toEqual({ id: 'patient-1', name: 'Andi' });
  });

  // 6. Test Update Data Pasien
  it('should successfully update a patient', async () => {
    const updateDto = { name: 'Andi Baru' };
    mockPrismaService.patient.update.mockResolvedValue({ id: 'patient-1', name: 'Andi Baru' });

    const result = await service.update('patient-1', updateDto);
    expect(result.name).toBe('Andi Baru');
    expect(prisma.patient.update).toHaveBeenCalled();
  });

  // 7. Test Remove / Hapus Pasien
  it('should successfully delete a patient', async () => {
    mockPrismaService.patient.delete.mockResolvedValue({ id: 'patient-1' });

    const result = await service.remove('patient-1');
    expect(result).toBeDefined();
    expect(prisma.patient.delete).toHaveBeenCalled();
  });
});
