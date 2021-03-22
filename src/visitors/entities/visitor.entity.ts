import { BaseAbstractEntity } from "../../global/base-abstract.entity";
import {Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';


@Entity()
export class Visitor extends BaseAbstractEntity {

    @Column({nullable:true})
        firstName: string;
        

    @Column({nullable:true})
        lastName: string;


    @Column({nullable: true})
        emailAddress: string;

    @Column({nullable: true})
        phoneNumber: number;

    @Column("simple-json",{nullable: true})
        visitLog: {datesOfVisit: string[]}


    //NEXT: Relationships

        



 /*Email & Password Verification **LATER*/
/*
    @Column({ default: false })
    isPrimaryEmailAddressVerified: boolean;

    @Column({ default: false })
    isBackupEmailAddressVerified: boolean;

    @Column({ nullable: true })
    passwordSalt: string;

    @Column({ select: false }) //don't select password whenever user is called. See https://typeorm.io/#/select-query-builder/hidden-columns
    passwordHash: string;

    //set to true if password change is required
    @Column({ default: false })
    isPasswordChangeRequired: boolean;

    //token to be generated when password change request is made
    @Column({ unique: true, nullable: true })
    resetPasswordToken: string;

    @Column({ nullable: true })
    resetPasswordExpiration: Date;

    @Column({ nullable: true })
    primaryEmailVerificationToken: string;

    @Column({ nullable: true })
    backupEmailVerificationToken: string;

    @Column({ nullable: true })
    emailVerificationTokenExpiration: Date; */
    


        

}
