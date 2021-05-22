import { Module } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { VisitorsController } from './visitors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Visitor } from './entities/visitor.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(),TypeOrmModule.forFeature([User,Visitor])],
  controllers: [VisitorsController],
  providers: [VisitorsService]
})
export class VisitorsModule {}
