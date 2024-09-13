import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    // AppService
    {
      provide:'app_service',
      useClass:AppService
    },
    {
      provide:'person',
      useValue:{
        name:'aaa',
        age:20
      }
    },
    {
      provide:'person2',
      useFactory(){
        return {
          name:'aaa',
          age:111
        }
      }
    },
    {
      provide:'person3',
      useFactory(person:{name:string},appService:AppService){
        return {
          name:person.name,
          desc:appService.getHello()
        }
      },
      inject:['person',AppService]
    },
    {
      provide:'person4',
      useExisting:'alias-person4',
      async useFactory(){
        await new Promise((resolve)=>{
          setTimeout(resolve,100)
        })
        return {
          name:'aaaaa',
          age:1111
        }
      }
    }
  ],
})
export class AppModule {}
