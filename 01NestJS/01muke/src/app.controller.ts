import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from './enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private configService:ConfigService) {
    // this.appService=new AppService
  }

  @Get()
  getHello(): string {
    const name=this.configService.get(ConfigEnum.NAME)
    console.log("🚀 ~ file: app.controller.ts:15 ~ AppController ~ getHello ~ name:", name)
    return this.appService.getHello();
  }
  @Get('app')
  getApp():string{
    return 'hello nest js 啊啊啊'
  }

  @Get('bb')
  getBb(){
    return 'abb'
  }
  @Get('qwe')
  getQuw(){
    return 'das'
  }
}
