import { User } from "src/users/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsEmail} from 'class-validator'
import { UpdateUserDto } from "src/users/dto/update-user.dto";

export class UpdateResidentDto {

    @ApiProperty({required: false})
    @IsNotEmpty()
    readonly firstName: string;
    @ApiProperty({required: false})
    @IsNotEmpty()
    readonly lastName: string;
    @ApiProperty({required: false})
    @IsNotEmpty()
    @IsEmail()
    readonly emailAddress:string;
    @ApiProperty({required: false})
    readonly middleName: string;
    @ApiProperty({required: false})
    readonly dateOfBirth: Date;
    @ApiProperty({required: false})
    readonly photo: string;
    @ApiProperty({required: false})
    
    user: UpdateUserDto;
    

    


}
