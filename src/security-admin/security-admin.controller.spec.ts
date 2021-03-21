import { Test, TestingModule } from '@nestjs/testing';
import { SecurityAdminController } from './security-admin.controller';
import { SecurityAdminService } from './security-admin.service';

describe('SecurityAdminController', () => {
  let controller: SecurityAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityAdminController],
      providers: [SecurityAdminService],
    }).compile();

    controller = module.get<SecurityAdminController>(SecurityAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
