import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { VisitorModule } from './visitor/visitor.module';
import { SecurityAdminModule } from './security-admin/security-admin.module';
import { ResidentModule } from './resident/resident.module';
import { HomeModule } from './home/home.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [ UserModule, AuthModule, VisitorModule, SecurityAdminModule, ResidentModule, HomeModule, RolesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
