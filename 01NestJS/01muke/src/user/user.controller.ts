import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, LoggerService, HttpException, HttpStatus } from '@nestjs/common';
// import {Logger} from '@nestjs/common'
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
// import { Logger } from 'nestjs-pino';

@Controller('user')
export class UserController {
  // private logger=new Logger(UserController.name)
  // private logger:Logger
  constructor(
    private readonly userService: UserService,
    @Inject(Logger) private readonly logger:LoggerService
  ) {
    // this.logger.log('UserController init')
  }

  @Post()
  create(@Body() user:User ) {
    // this.logger.log(`请求成功`)
    // 不是管理员不让创建  试一下全局异常处理
    // if(!user.isAdmin){
    //   throw new HttpException('error message FORBIDDEN', HttpStatus.FORBIDDEN)
    // }
    return this.userService.create(user);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('profile/:id')
  getUserProfile(@Param('id') id:string){
    return this.userService.findProfile(+id)
  }
  @Get('/logs/:id')
  getUserLogs(@Param('id') id:number):any{
    return this.userService.findUserLogs(id)
  }

  @Get('getLogsByGroup')
  getLogsByGroup(){
    const res= this.userService.findLogsByGroup()
    return res.map((o)=>({
      result:o.result,
      count:o.count
    }))
  }
}
