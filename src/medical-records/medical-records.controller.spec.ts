import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRecordsController } from './medical-records.controller';
import { MedicalRecordsService } from './medical-records.service';

describe('MedicalRecordsController', () => {
  let controller: MedicalRecordsController;
  let service: MedicalRecordsService;

  const mockMedicalRecordsService = {
    create: jest.fn().mockResolvedValue({ id: 'mr-1', complaint: 'Demam' }),
    findByPatient: jest.fn().mockResolvedValue([{ id: 'mr-1', complaint: 'Demam' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalRecordsController],
      providers: [
        { provide: MedicalRecordsService, useValue: mockMedicalRecordsService },
      ],
    }).compile();

    controller = module.get<MedicalRecordsController>(MedicalRecordsController);
    service = module.get<MedicalRecordsService>(MedicalRecordsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getByPatient endpoint', async () => {
    const result = await controller.getByPatient('patient-id-123');
    expect(result).toBeDefined();
    expect(service.findByPatient).toHaveBeenCalledWith('patient-id-123');
  });
});
