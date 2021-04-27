
import { CreateUserDto } from "src/users/dto/create-user.dto";


// Only need these when creating a visitor. 
// Since its a demo, there will be only one visitor with an ID of 1 in the database.
// All the invitation mails will be sent to this single visitor since I have a limited number email address
export class CreateVisitorDto {
    readonly firstName:string;
    readonly lastName: string;
    readonly emailAddress: string;
    readonly phoneNumber: string;
    visitToken: string;
    visitorTokenExpirationDate: Date;
   
  
    
}
