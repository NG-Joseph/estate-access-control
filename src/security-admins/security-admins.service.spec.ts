import { Test, TestingModule } from '@nestjs/testing';
import { SecurityAdminsService } from './security-admins.service';

describe('SecurityAdminsService', () => {
  let service: SecurityAdminsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityAdminsService],
    }).compile();

    service = module.get<SecurityAdminsService>(SecurityAdminsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
