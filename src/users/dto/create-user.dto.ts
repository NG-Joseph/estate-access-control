import { IsNotEmpty } from 'class-validator';



// Update dto cannot be readonly because they will more than likely be overwritten
export class CreateUserDto {
   firstName?: string;

   lastName?: string;

   middleName?: string;

   emailAddress?: string;

   dateOfBirth?: Date;

   passwordSalt?: string; 

  passwordHash?: string; 
}

// password for demo user is password