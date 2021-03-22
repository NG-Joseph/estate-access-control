import { Module } from '@nestjs/common';
import { SecurityAdminsService } from './security-admins.service';
import { SecurityAdminsController } from './security-admins.controller';

@Module({
  controllers: [SecurityAdminsController],
  providers: [SecurityAdminsService]
})
export class SecurityAdminsModule {}
