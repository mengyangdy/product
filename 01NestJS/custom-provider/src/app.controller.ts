import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    // private readonly appService: AppService
    @Inject('app_service') private readonly appService:AppService,
    @Inject('person') private readonly person:{name:string,age:number},
    @Inject('person2') private readonly person2:{name:string,age:number}

  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
