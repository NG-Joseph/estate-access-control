import { BaseAbstractEntity } from "../../global/base-abstract.entity";
import {Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { Resident } from "src/residents/entities/resident.entity";
import { Visitor } from "src/visitors/entities/visitor.entity";


@Entity()
export class SecurityAdmin extends BaseAbstractEntity {
    @Column({nullable:true})
    firstName: string

    @Column({nullable:true})
    lastName: string
    
    @Column()
    middleName: string;

    @Column({nullable:true})
    dateOfBirth: Date

    @Column()
    photo:string; // url to photo from cdn

    @OneToMany(type => Resident, resident => resident.securityOfficer )
    assignedResidents: Resident[]

    @OneToMany(type => Visitor, visitor => visitor.securityOfficer )
    assignedVisitors: Visitor[]


}
