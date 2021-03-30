import { Resident } from "src/residents/entities/resident.entity";
import { Home } from "../entities/home.entity";

export class CreateHomeDto {
    address: string;
    description: string;
    contactDetails: {phoneNumbers: string[], emails:string[]}
    homeOwner: Resident[]
    
}
