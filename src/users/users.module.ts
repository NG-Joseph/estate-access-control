import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';


import { Visitor } from 'src/visitors/entities/visitor.entity';
import { User } from './entities/user.entity';


@Module({
  imports:[ScheduleModule.forRoot(),TypeOrmModule.forFeature([User, Visitor])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
