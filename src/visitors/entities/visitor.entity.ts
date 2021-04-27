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



@Entity()
export class Visitor extends BaseAbstractEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;



  @Column({ nullable: true })
  emailAddress: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({nullable:true})
  visitToken: string
  
  @Column({nullable:true})
  visitorTokenExpirationDate: Date

  

  //NEXT: Relationships

  @ManyToOne(
    type => User,
    user => user.visitor,
  )
  @JoinColumn()
  user: User;

 
  

}
