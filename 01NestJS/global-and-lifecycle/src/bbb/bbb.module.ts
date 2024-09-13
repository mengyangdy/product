import { Module } from '@nestjs/common';
import { BbbService } from './bbb.service';
import { BbbController } from './bbb.controller';
import { AaaService } from 'src/aaa/aaa.service';
import { AaaModule } from 'src/aaa/aaa.module';
import { AppService } from 'src/app.service';

@Module({
  // imports:[AaaModule],
  controllers: [BbbController],
  providers: [BbbService,AppService],
})
export class BbbModule {}
