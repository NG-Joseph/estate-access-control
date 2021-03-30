import { BaseAbstractEntity } from '../../global/base-abstract.entity';
import {
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Resident } from 'src/residents/entities/resident.entity';
import { SecurityAdmin } from 'src/security-admins/entities/security-admin.entity';


@Entity()
export class Visitor extends BaseAbstractEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  middleName: string;



  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  emailAddress: string;

  @Column({ nullable: true })
  phoneNumber: number;

  @Column('simple-json', { nullable: true })
  visitLog: { datesOfVisit: string[] };

  @Column({ nullable: true }) //null if auto approved
  approvedBy: number;

  @Index()
  @Column({ default: false })
  approved: boolean;

  //NEXT: Relationships

  @OneToOne(
    type => User,
    user => user.visitor,
  )
  @JoinColumn()
  user: User;

  //TODO: Research on using joincolumn() properly
  @ManyToOne(
    type => Resident,
    resident => resident.visitor,
  )
  @JoinColumn()
  residentToVisit: Resident;

  @ManyToOne(
    type => SecurityAdmin,
    securityAdmin => securityAdmin.assignedVisitors,
  )
  @JoinColumn()
  securityOfficer: SecurityAdmin;

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
  emailVerificationTokenExpiration: Date;
}
