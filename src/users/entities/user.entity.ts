import { BaseAbstractEntity } from "../../global/base-abstract.entity";
import {Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { Role } from "src/roles/entities/role.entity";
import { Visitor } from "src/visitors/entities/visitor.entity";


@Entity()
export class User extends BaseAbstractEntity{
    @Column()
        firstName: string;

    @Column()
        lastName: string

    @Column({ nullable: true })
        photo: string; //photo file location. Use stream to send

    @Column({ nullable: true })
        photoMimeType: string; //save the encoding of uploaded file for content-type use for reply.type as shown above

    @Column({ unique: true })
        @Index()
            primaryEmailAddress: string;
            

    @Column()
        roles: string // TODO Add role relationship (Many2Many)


    @Column()
        resident: string // If user is a resident (one 2 one)
        // TODO Add relationship


    @OneToOne(type => Visitor, visitor => visitor.user)
        visitor: Visitor //if user is a visitor

}
