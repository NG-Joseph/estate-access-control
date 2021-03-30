import { BaseAbstractEntity } from "../../global/base-abstract.entity";
import {Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, OneToOne, ManyToOne } from 'typeorm';
import { Resident } from "src/residents/entities/resident.entity";

@Entity()
export class Home extends BaseAbstractEntity{
    @Column()
        address: string;
    @Column()
        description: string;

    @Column('simple-json')
    contactDetails: {phoneNumbers: string[], emails:string[]}


    /* Relationships*/ 
    @ManyToMany(type => Resident, resident => resident.home)// Multiple homes can be owned by multiple residents and a home can have more than one resident
    homeOwner: Resident[];  // TODO Add Many To Many Relationship With Resident.


        
}
