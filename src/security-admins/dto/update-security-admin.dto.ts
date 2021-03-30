import { SecurityAdminRole } from "src/global/app.enum";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { CreateVisitorDto } from "src/visitors/dto/create-visitor.dto";

export class UpdateSecurityAdminDto {
    firstName: string;
    lasttName: string;
    middleName: string;
    emailAddress: string;
    user:CreateUserDto;
    assignedVisitors: CreateVisitorDto[];
    roles: SecurityAdminRole[]
}
