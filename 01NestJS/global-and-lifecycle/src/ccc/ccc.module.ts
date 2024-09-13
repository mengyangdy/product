import { Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { CccService } from './ccc.service';
import { CccController } from './ccc.controller';

@Module({
  controllers: [CccController],
  providers: [CccService],
})
export class CccModule implements OnModuleInit,OnApplicationBootstrap {
  onModuleInit() {
    console.log("🚀 ~ file: ccc.module.ts:11 ~ CccModule ~ onModuleInit ~ onModuleInit~")
    
  }
  onApplicationBootstrap() {
    console.log("🚀 ~ file: ccc.module.ts:15 ~ CccModule ~ onApplicationBootstrap ~ onApplicationBootstrap~")
    
  }
}
