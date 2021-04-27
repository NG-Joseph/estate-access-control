
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class UpdateVisitorDto {
     readonly firstName:string;
     readonly lastName: string;
     readonly emailAddress: string;
     readonly phoneNumber: string;
     visitToken: string;
     visitorTokenExpirationDate: Date;
  
  
    
}
