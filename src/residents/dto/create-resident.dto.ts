import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";

export class CreateResidentDto {

    firstName: string;
    lastName: string;
    emailAddress:string;
    middleName: string;
    dateOfBirth: Date;
    photo: string;
    user: CreateUserDto;
    

    


}
