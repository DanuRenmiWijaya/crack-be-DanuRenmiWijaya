import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: AppointmentsService;

  const mockAppointmentsService = {
    create: jest.fn().mockResolvedValue({ id: '1', queueNumber: 1, status: 'PENDING' }),
    findByPatient: jest.fn().mockResolvedValue([{ id: '1', queueNumber: 1 }]),
    getTrackingStatus: jest.fn().mockResolvedValue({ queueNumber: 1, peopleAhead: 0 }),
    update: jest.fn().mockResolvedValue({ id: '1', status: 'PENDING' }),
    cancel: jest.fn().mockResolvedValue({ id: '1', status: 'CANCELLED' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        { provide: AppointmentsService, useValue: mockAppointmentsService },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create appointment', async () => {
    const dto = { department: 'Poli Umum', visitDate: '2026-05-20' };
    const req = { user: { sub: 'patient-id-123' } };
    
    const result = await controller.create(dto, req);
    expect(result).toBeDefined();
    expect(service.create).toHaveBeenCalledWith(dto, req.user.sub);
  });
});
