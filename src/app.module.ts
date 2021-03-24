import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { HomesModule } from './homes/homes.module';
import { VisitorsModule } from './visitors/visitors.module';
import { UsersModule } from './users/users.module';
import { SecurityAdminsModule } from './security-admins/security-admins.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './app.database.module';

@Module({
  imports: [  RolesModule, HomesModule, VisitorsModule, UsersModule, SecurityAdminsModule, ConfigModule.forRoot(),DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
