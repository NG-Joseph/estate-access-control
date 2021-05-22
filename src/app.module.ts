import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { VisitorsModule } from './visitors/visitors.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './app.database.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [ ScheduleModule.forRoot()  ,VisitorsModule, UsersModule, ConfigModule.forRoot(),DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
