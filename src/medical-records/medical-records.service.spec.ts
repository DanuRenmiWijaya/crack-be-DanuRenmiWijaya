import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRecordsService } from './medical-records.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MedicalRecordsService', () => {
  let service: MedicalRecordsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    medicalRecord: {
      create: jest.fn().mockResolvedValue({ id: 'mr-123', complaint: 'Sakit Kepala' }),
      findMany: jest.fn().mockResolvedValue([{ id: 'mr-123', complaint: 'Sakit Kepala' }]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalRecordsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MedicalRecordsService>(MedicalRecordsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a medical record successfully', async () => {
    const dto = { patientId: 'p-1', complaint: 'Sakit Kepala', diagnosis: 'Migrain' };
    const doctorId = 'doc-99';
    
    const result = await service.create(dto, doctorId);
    expect(result).toBeDefined();
    expect(prisma.medicalRecord.create).toHaveBeenCalled();
  });
});
