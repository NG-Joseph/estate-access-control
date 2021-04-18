import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from 'src/roles/entities/role.entity';
import { Visitor } from 'src/visitors/entities/visitor.entity';
import { User } from './entities/user.entity';
import { SecurityAdmin } from 'src/security-admins/entities/security-admin.entity';
import { Home } from 'src/homes/entities/home.entity';
import { Resident } from 'src/residents/entities/resident.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, Role, Visitor, SecurityAdmin, Home, Resident])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
