import { SecurityAdminRole } from "src/global/app.enum";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { CreateVisitorDto } from "src/visitors/dto/create-visitor.dto";
import { Visitor } from "src/visitors/entities/visitor.entity";
import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsNotEmpty} from 'class-validator'

export class UpdateSecurityAdminDto {
    @ApiProperty({required:false})
    @IsNotEmpty()
    readonly firstName: string;
    @ApiProperty({required:false})
    @IsNotEmpty()
    readonly lastName: string;
    @ApiProperty({required:false})
    readonly middleName: string;
    @ApiProperty({required:false})
    @IsEmail()
    readonly emailAddress: string;
    @ApiProperty({required:false})
    readonly user:CreateUserDto;
    @ApiProperty({required:false})
    readonly assignedVisitors: Visitor[];
    @ApiProperty({required:false})
    readonly roles: SecurityAdminRole[]
}
