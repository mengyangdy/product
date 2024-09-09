import { Logs } from "src/logs/entities/log.entity";
import { Roles } from "src/roles/entities/role.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id:number
  @Column({unique:true})
  username:string
  @Column()
  password:string

  @OneToOne(()=>Profile,(profile)=>profile.user)
  profile:Profile

  @OneToMany(()=>Logs,(logs)=>logs.user)
  logs:Logs[]

  @ManyToMany(()=>Roles,(roles)=>roles.users)
  // @JoinTable()
  @JoinTable({name:'users_roles'})
  roles:Roles[]
}
