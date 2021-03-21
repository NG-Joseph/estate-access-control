import { Test, TestingModule } from '@nestjs/testing';
import { SecurityAdminService } from './security-admin.service';

describe('SecurityAdminService', () => {
  let service: SecurityAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityAdminService],
    }).compile();

    service = module.get<SecurityAdminService>(SecurityAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
