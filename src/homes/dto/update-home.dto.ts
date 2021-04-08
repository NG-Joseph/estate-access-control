import { Resident } from "src/residents/entities/resident.entity";
import { Home } from "../entities/home.entity";

export class UpdateHomeDto {
    readonly address: string;
    readonly description: string;
    readonly contactDetails: {phoneNumbers: string[], emails:string[]}
    readonly homeOwner: Resident[]
    
}
