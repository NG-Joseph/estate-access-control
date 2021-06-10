
import { CreateUserDto } from "src/users/dto/create-user.dto";


// Only need these when creating a visitor. 


export class CreateVisitorDto {
    readonly firstName:string;
    readonly lastName: string;
    readonly emailAddress: string;
    readonly phoneNumber: string;
    visitOtp?: string;
    visitorOtpExpirationDate: Date;
   
  
    
}
