import { SecurityAdminRole } from "src/global/app.enum";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { CreateVisitorDto } from "src/visitors/dto/create-visitor.dto";
import { Visitor } from "src/visitors/entities/visitor.entity";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";

export class CreateSecurityAdminDto {
    @ApiProperty()
    readonly firstName: string;
    @ApiProperty()
    readonly lastName: string;
    @ApiProperty()
    readonly middleName: string;
    @ApiProperty()
    readonly emailAddress: string;
    @ApiProperty()
    readonly user:User;
    @ApiProperty()
    readonly assignedVisitors: Visitor[];
    @ApiProperty()
    readonly roles: SecurityAdminRole[]
}
