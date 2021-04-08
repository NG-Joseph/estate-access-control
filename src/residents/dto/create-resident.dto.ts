import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsNotEmpty} from 'class-validator'
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";


export class CreateResidentDto {

    @ApiProperty({required: false})
    @IsNotEmpty()
    firstName: string;
    @ApiProperty({required: false})
    @IsNotEmpty()
    lastName: string;
    @ApiProperty({required: false})
    @IsNotEmpty()
    @IsEmail()
    emailAddress:string;
    @ApiProperty({required: false})
    middleName: string;
    @ApiProperty({required: false})
    dateOfBirth: Date;
    @ApiProperty({required: false})
    photo: string;
    @ApiProperty()
    @IsNotEmpty()
    user: CreateUserDto;
    

    


}
