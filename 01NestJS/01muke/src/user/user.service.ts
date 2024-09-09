import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository:Repository<User>){}
  async create(user: User) {
    // 用户名不能重复  该怎么捕获错误给前端返回？

   const userTmp=await this.userRepository.create(user)
   return this.userRepository.save(userTmp)
  }

  findAll(query) {
    const {limit,page,username,gender,role} =query
    /**
     * SELECT * FROM user u,profile p,role r WHERE u.id = p.uid AND u.id = r.uid AND ...
     * 
     * SELECT * FROM user u LEFT JOIN profile p ON u.id=p.uid LEFT JOIN role r ON u.id = r.uid WHERE...
     * 分页 SQL ==LEMIT10 OFFSET 10
     * 
     */
    // return this.userRepository.find({
    //   select:{
    //     id:true
    //   },
    //   relations:{
    //     profile:true,
    //     roles:true
    //   },
    //   where:{
    //     username,
    //     profile:{
    //       gender
    //     },
    //     roles:{
    //       id:role
    //     }
    //   },
    //   take:limit,
    //   skip:(page - 1) * limit
    // })

    return this.userRepository.createQueryBuilder('user')
    // innerJoin 与leftJoin的区别 
    .innerJoinAndSelect('user.profile','profile')
    .innerJoinAndSelect('user.roles','roles')
    .where('user.username = :username',{username})
    .andWhere('profile.gender = :gender',{gender})
    .andWhere('roles.id = :role',{role})
    .getMany()
  }

  findOne(id:number) {
    return this.userRepository.findOne({where:{id}})
  }

  async update(id: number, user:Partial<User>) {
    const userTemp=await this.findProfile(id)
    const newUser=this.userRepository.merge(userTemp,user)
    // 联合模型更新 需要使用save方法 或者queryBuilder
    return  this.userRepository.save(newUser)


    // 下面的update方法只适用于单模型的更新 不适合有关系的模型更新
    return this.userRepository.update(id,user)
  }

  remove(id: number) {
    return this.userRepository.delete(id)
  }

  findProfile(id:number){
    return this.userRepository.findOne({
      where:{
        id
      },
      relations:{
        profile:true
      }
    })
  }

  async findUserLogs(id:number){
    const user=await this.userRepository.findOne({
      where:{
        id
      }
    })

    return this.logsRepository.find({
      where:{
        user
      },
      relations:{
        user:true
      }
    })
  }

  findLogsByGroup(id:number){
    //SELECT logs.result as result, COUNT(logs.result) as count from logs ,user WHERE user.id = logs.userId AND user.id =2 GROUP BY logs.result
    // return this.logsRepository
    // .createQueryBuilder('logs')
    // .select('logs.result','result')
    // .addSelect('COUNT("logs.result")','count')
    // .leftJoinAndSelect('logs.user','user')
    // .where('user.id = :id',{id})
    // .groupBy('logs.result')
    // // .orderBy('result','DESC')
    // .orderBy('count','DESC')
    // .addOrderBy('result','DESC')
    // .offset(2)
    // .limit(3)
    // .getRawmany()
    // 使用sql语句查询
    return this.logsRepository.query('SELECT * from logs')
  }
}
