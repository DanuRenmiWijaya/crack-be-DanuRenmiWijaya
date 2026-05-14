import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn().mockResolvedValue({ id: '1', username: 'admin_rs', name: 'Dr. Danu' }),
    login: jest.fn().mockResolvedValue({ access_token: 'mock_jwt_token' }),
    patientLogin: jest.fn().mockResolvedValue({ access_token: 'mock_patient_token' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call register service with dto', async () => {
    const dto = { username: 'admin_rs', password: 'password123', name: 'Dr. Danu', role: 'ADMIN' };
    const result = await controller.register(dto);
    
    expect(result).toBeDefined();
    expect(service.register).toHaveBeenCalledWith(dto);
  });

  it('should call login service with dto', async () => {
    const dto = { username: 'admin_rs', password: 'password123' };
    const result = await controller.login(dto);
    
    expect(result).toHaveProperty('access_token');
    expect(service.login).toHaveBeenCalledWith(dto);
  });
});
