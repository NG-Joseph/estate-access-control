import { Test, TestingModule } from '@nestjs/testing';
import { SecurityAdminsController } from './security-admins.controller';
import { SecurityAdminsService } from './security-admins.service';

describe('SecurityAdminsController', () => {
  let controller: SecurityAdminsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityAdminsController],
      providers: [SecurityAdminsService],
    }).compile();

    controller = module.get<SecurityAdminsController>(SecurityAdminsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
