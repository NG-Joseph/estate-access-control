import { Resident } from "src/residents/entities/resident.entity";
import { CreateSecurityAdminDto } from "src/security-admins/dto/create-security-admin.dto";
import { SecurityAdmin } from "src/security-admins/entities/security-admin.entity";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateVisitorDto {
    firstName:string;
    lastName: string;
    middleName: string;
    photo: string;
    emailAddress: string;
    phoneNumber: number;
    visitLog: {daysOfVisit: Date[]};
    user:CreateUserDto;
  
    
}
