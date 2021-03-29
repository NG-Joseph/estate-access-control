import { BaseAbstractEntity } from "../../global/base-abstract.entity";
import { User } from "../../users/entities/user.entity";
import { Column, Entity, ManyToMany, OneToMany, OneToOne, JoinColumn, JoinTable } from "typeorm";
import { Home } from "src/homes/entities/home.entity";
import { Visitor } from "src/visitors/entities/visitor.entity";
import { SecurityAdmin } from "src/security-admins/entities/security-admin.entity";
import { Gender } from "src/global/app.enum";

@Entity()
export class Resident {
@Column({nullable:true})
    firstName: string;

@Column()
    lastName: string;

@Column()
    middleName: string;

@Column({nullable:true})
    dateOfBirth: Date

@Column({enum: Gender})
    gender: Gender

@Column()
    photo:string;

// Relationships

@OneToOne(type => User, user => user.resident)
@JoinColumn()
user: User;

@ManyToMany(type =>Home, home => home.homeOwner)
@JoinTable()
home: Home[];

@OneToMany(type =>Visitor, visitor => visitor.residentToVisit)
@JoinColumn()
visitor: Visitor[];

@OneToMany(type => SecurityAdmin, securityAdmin => securityAdmin.assignedResident)
securityOfficer: SecurityAdmin


}
