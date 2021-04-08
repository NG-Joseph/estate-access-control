import { BaseAbstractEntity } from "../../global/base-abstract.entity";
import {Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { Role } from "src/roles/entities/role.entity";
import { Visitor } from "src/visitors/entities/visitor.entity";
import { Resident } from "src/residents/entities/resident.entity";
import { type } from "os";
import Joi from "@hapi/joi";
import { SecurityAdmin } from "src/security-admins/entities/security-admin.entity";


@Entity()
export class User extends BaseAbstractEntity{
    @Column()
        firstName: string;

    @Column()
        lastName: string
    @Column()
        middleName: string

    @Column({ nullable: true })
        photo: string; //photo file location. Use stream to send

    @Column({ nullable: true })
        photoMimeType: string; //save the encoding of uploaded file for content-type use for reply.type as shown above

    @Column({nullable:true})
        passwordHash: string;

    @Column({nullable: true})
        phoneNumber:number;

    @Column({nullable: true})
        passwordSalt: string;

    @Column({nullable: true})
        primaryEmailVerificationToken: string;

    @Column()
    emailVerificationTokenExpiration: Date;


    @Column()
    isPrimaryEmailAddressVerified: boolean

    @Column()
    refreshTokenHash: string

    @Column({ unique: true })
        @Index()
            primaryEmailAddress: string;
            

    @ManyToMany(type => Role, role => role.users)
    @JoinTable()
        roles: Role[] 


    @OneToOne(type => Resident, resident => resident.user)
        resident: Resident // If user is a resident (one 2 one)
        


    @OneToOne(type => Visitor, visitor => visitor.user)
        visitor: Visitor //if user is a visitor


    @OneToOne(type => SecurityAdmin, securityAdmin => securityAdmin.user)
        securityAdmin: SecurityAdmin //if user is a security Admin

    

}
