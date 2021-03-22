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
import { HomesModule } from './homes/homes.module';
import { VisitorsModule } from './visitors/visitors.module';
import { UsersModule } from './users/users.module';
import { SecurityAdminsModule } from './security-admins/security-admins.module';

@Module({
  imports: [ UserModule, AuthModule, VisitorModule, SecurityAdminModule, ResidentModule, HomeModule, RolesModule, HomesModule, VisitorsModule, UsersModule, SecurityAdminsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
