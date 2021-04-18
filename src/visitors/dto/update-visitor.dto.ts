import { Resident } from "src/residents/entities/resident.entity";
import { CreateSecurityAdminDto } from "src/security-admins/dto/create-security-admin.dto";
import { SecurityAdmin } from "src/security-admins/entities/security-admin.entity";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class UpdateVisitorDto {
    readonly firstName:string;
    readonly lastName: string;
    readonly middleName: string;
    readonly photo: string;
    readonly emailAddress: string;
    readonly phoneNumber: number;
    readonly visitLog: {daysOfVisit: Date[]};
    readonly user:CreateUserDto;
  
    
}
