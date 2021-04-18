import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';

import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { Visitor } from 'src/visitors/entities/visitor.entity';
import { Home } from 'src/homes/entities/home.entity';
import { Resident } from 'src/residents/entities/resident.entity';



@Module({
  imports: [UsersModule, 
    PassportModule, //alternatively, we can specify default strategy if we have more than one, as done below
    //PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User, Role, Visitor, Home, Resident]),
    JwtModule.register({}),
    
  ],
  providers: [AuthService, LocalStrategy, UsersService, JwtStrategy, 
     JwtRefreshTokenStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
