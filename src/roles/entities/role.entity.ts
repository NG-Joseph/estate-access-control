import { BaseAbstractEntity } from "../../global/base-abstract.entity";
import { User } from "../../users/entities/user.entity";
import { Column, Entity, ManyToMany } from "typeorm";


@Entity()
export class Role extends BaseAbstractEntity{
    
    @Column({unique: true})
    name: string;

    @Column({nullable: true})//setting primary to true here means that this is unique
    description: string;


    //define many-to-many relationship with user. See https://github.com/typeorm/typeorm/blob/master/docs/many-to-many-relations.md
    @ManyToMany(type => User, user => user.roles, {cascade: true, onDelete: 'CASCADE'})
    users: User[];
}
