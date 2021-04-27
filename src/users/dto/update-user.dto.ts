import { IsNotEmpty } from 'class-validator';



// Update dto cannot be readonly because they will more than likely be overwritten
export class UpdateUserDto {
   firstName?: string;

   lastName?: string;

   middleName?: string;

   emailAddress?: string;

   dateOfBirth?: Date;

   passwordSalt?: string; 

  passwordHash?: string; 
}
