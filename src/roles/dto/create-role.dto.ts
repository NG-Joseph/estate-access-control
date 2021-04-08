import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {
    @ApiProperty({required:false})
    name: string;
    @ApiProperty({required:false})
    description: string;
    
}
