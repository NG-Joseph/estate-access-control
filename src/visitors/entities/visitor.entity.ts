import { GlobalEntity } from '../../global/global-entity';
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



@Entity()
export class Visitor extends GlobalEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;



  @Column({ nullable: true })
  emailAddress: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({nullable:true})
  visitOtp: string
  
  @Column({nullable:true})
  visitorotpexpirationdate: Date  // Changed to lowercase because of a typeorm bug that kept converting it to lowercase wrongly causing error.

  

  //NEXT: Relationships

  @ManyToOne(
    type => User,user => user.visitor,)
  @JoinColumn()
  user: User;

 
  

}
