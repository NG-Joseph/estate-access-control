import { BaseAbstractEntity } from "../../global/base-abstract.entity";
import {Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Home extends BaseAbstractEntity{
    @Column()
        address: string;
    @Column()
        description: string;

    @Column('simple-json')
    contactDetails: {phoneNumbers: string[], email:string}


    /* Relationships*/ 
        
    @Column()
        owner: string // TODO Add Many To Many Relationship With Resident.


        
}
