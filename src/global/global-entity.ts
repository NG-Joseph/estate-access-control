
import {Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';


export abstract class GlobalEntity {//columns common to all entities to be inherited
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @CreateDateColumn() //update this automatically on creation
    dateCreated: Date;

    @Column({nullable: true})
    createdBy: string;//just use the username, fullname, userid. For audit purpose. No need for relations

    @UpdateDateColumn() //update this automatically whenever there is modification
    dateLastModified: Date;

    @Column({nullable: true})
    lastModifiedBy: string;//just use the username, fullname, userid. For audit purpose. No need for relations

    @Column({nullable: true})
    lastChangeInfo: string;

    @Column({nullable: true})
    deletedBy: string;

}
