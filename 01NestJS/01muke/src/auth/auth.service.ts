import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  async signin(username:string,password:string){
    const res=await this.userService.findAll({username})
    return  res
  }
  async signup(username:string,password:string){
    const res=await this.userService.create()
  }
}
