import {IsNotEmpty} from 'class-validator'
import { ApiProperty } from "@nestjs/swagger";
export class UpdateUserDto {
    @ApiProperty({ required: false })
    @IsNotEmpty()
    readonly firstName?: string;
    @ApiProperty({ required: false })
    @IsNotEmpty()
    readonly lastName?: string;
    @ApiProperty({ required: false })
    @IsNotEmpty()
    readonly emailAddress?: string;
    @ApiProperty({ required: false })
    readonly dateOfBirth?: Date;
    @ApiProperty({ required: false })
    readonly middleName?: string;
    @ApiProperty({ required: false })
    readonly photo?: string;
    @ApiProperty({ required: false })
    readonly photoMimeType?: string;
  
    @ApiProperty({ required: false })
    readonly passwordSalt?: string;
  
    @ApiProperty({ required: false })
  
    passwordHash: string; //not readonly because it will be replaced by hash in the insertusers function
  
    @ApiProperty({ required: false })
    readonly refreshTokenHash: string;
  
    @ApiProperty({ required: false })
    readonly primaryEmailVerificationToken: string;
  
    @ApiProperty({ required: false })
  
    readonly emailVerificationTokenExpiration: string;
  
    @ApiProperty({ required: false })
   
    readonly isPrimaryEmailAddressVerified: boolean;


}
