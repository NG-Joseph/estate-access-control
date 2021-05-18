import { GlobalEntity } from "../../global/global-entity";
import {Column,  Entity, OneToMany } from 'typeorm';

import { Visitor } from "src/visitors/entities/visitor.entity";



@Entity()
export class User extends GlobalEntity{
    @Column()
        firstName: string;

    @Column()
        lastName: string

    @Column()
        middleName: string

    @Column()
        dateOfBirth: Date

   
    @Column({nullable:true})
        passwordHash: string; //encrypted version of password with bcrypt

    @Column({nullable: true})
        phoneNumber:number;
   

   
    @Column({ unique: true })
            emailAddress: string;
            

   
//user is a resident and can have many visitors
    @OneToMany(type => Visitor, visitor => visitor.user)
        visitor: Visitor 



    

}
