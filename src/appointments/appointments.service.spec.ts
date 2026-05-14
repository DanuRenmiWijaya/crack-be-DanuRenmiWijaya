import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let prisma: PrismaService;

  // Mocking Prisma Service dengan fungsi pencatatan antrean lengkap
  const mockPrismaService = {
    appointment: {
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn().mockResolvedValue({ id: 'app-1', queueNumber: 1 }),
      findMany: jest.fn().mockResolvedValue([{ id: 'app-1', queueNumber: 1 }]),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    // @ts-ignore
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 1. Test Pembuatan Antrean Baru (Success)
  describe('create', () => {
    it('should successfully create an appointment and increment queue number', async () => {
      const dto = { department: 'Poli Umum', visitDate: '2026-05-20' };
      mockPrismaService.appointment.count.mockResolvedValue(2); // Simulasi sudah ada 2 pendaftar
      mockPrismaService.appointment.create.mockResolvedValue({ id: 'app-1', queueNumber: 3 });

      const result = await service.create(dto, 'patient-123');
      expect(result).toBeDefined();
      expect(result.queueNumber).toBe(3);
      expect(mockPrismaService.appointment.create).toHaveBeenCalled();
    });
  });

  // 2. Test Ambil Daftar Janji Temu Pasien (Find Many)
  describe('findByPatient', () => {
    it('should return a list of appointments for a specific patient', async () => {
      const result = await service.findByPatient('patient-123');
      expect(result).toEqual([{ id: 'app-1', queueNumber: 1 }]);
      expect(mockPrismaService.appointment.findMany).toHaveBeenCalled();
    });
  });

  // 3. Test Pelacakan Sisa Antrean (Tracking Status)
  describe('getTrackingStatus', () => {
    it('should calculate remaining queue ahead and estimated waiting time', async () => {
      const mockActiveBooking = { id: 'app-1', department: 'Poli Umum', visitDate: new Date(), queueNumber: 5, status: 'PENDING' };
      mockPrismaService.appointment.findFirst.mockResolvedValue(mockActiveBooking);
      mockPrismaService.appointment.count.mockResolvedValue(2); // Simulasi ada 2 orang di depan

      const result = await service.getTrackingStatus('patient-123');
      expect(result).toHaveProperty('peopleAhead', 2);
      expect(result).toHaveProperty('estimatedWait', 20); // 2 orang * 10 menit
    });

    it('should return null if patient has no active pending/calling appointment', async () => {
      mockPrismaService.appointment.findFirst.mockResolvedValue(null);
      const result = await service.getTrackingStatus('patient-123');
      expect(result).toBeNull();
    });
  });

  // 4. Test Update Jadwal / Reschedule Kunjungan
  describe('update', () => {
    it('should successfully update appointment schedule if status is PENDING', async () => {
      const dto = { department: 'Poli Gigi', visitDate: '2026-05-22' };
      mockPrismaService.appointment.findFirst.mockResolvedValue({ id: 'app-1', patientId: 'patient-123', status: 'PENDING' });
      mockPrismaService.appointment.update.mockResolvedValue({ id: 'app-1', department: 'Poli Gigi' });

      const result = await service.update('app-1', dto, 'patient-123');
      expect(result.department).toBe('Poli Gigi');
    });
  });

  // 5. Test Pembatalan Janji Temu (Cancel Action)
  describe('cancel', () => {
    it('should change appointment status to CANCELLED', async () => {
      mockPrismaService.appointment.findFirst.mockResolvedValue({ id: 'app-1', patientId: 'patient-123' });
      mockPrismaService.appointment.update.mockResolvedValue({ id: 'app-1', status: 'CANCELLED' });

      const result = await service.cancel('app-1', 'patient-123');
      expect(result.status).toBe('CANCELLED');
      expect(mockPrismaService.appointment.update).toHaveBeenCalled();
    });
  });
});
