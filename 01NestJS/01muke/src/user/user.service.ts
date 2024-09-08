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
   const userTmp=await this.userRepository.create(user)
   return this.userRepository.save(userTmp)
  }

  findAll() {
    return this.userRepository.find()
  }

  findOne(id:number) {
    return this.userRepository.findOne({where:{id}})
  }

  update(id: number, user:Partial<User>) {
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
