import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

describe('PatientsController', () => {
  let controller: PatientsController;
  let service: PatientsService;

  const mockPatientsService = {
    create: jest.fn().mockResolvedValue({ id: '1', name: 'Budi Santoso' }),
    findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Budi Santoso' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Budi Santoso' }),
    getTodayStats: jest.fn().mockResolvedValue({ newPatients: 5, totalVisits: 3 }),
    update: jest.fn().mockResolvedValue({ id: '1', name: 'Budi Santoso (Updated)' }),
    remove: jest.fn().mockResolvedValue({ id: '1', deleted: true }),
    exportToExcel: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        { provide: PatientsService, useValue: mockPatientsService },
      ],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll data pasien', async () => {
    const result = await controller.findAll();
    expect(result).toBeDefined();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call getStats harian', async () => {
    const result = await controller.getStats();
    expect(result).toEqual({ newPatients: 5, totalVisits: 3 });
    expect(service.getTodayStats).toHaveBeenCalled();
  });
});
