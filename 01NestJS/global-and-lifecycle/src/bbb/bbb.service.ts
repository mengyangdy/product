import { Injectable } from '@nestjs/common';
import { CreateBbbDto } from './dto/create-bbb.dto';
import { UpdateBbbDto } from './dto/update-bbb.dto';
import { AppService } from 'src/app.service';

@Injectable()
export class BbbService {
  // constructor(private aaaService:AaaService){

  // }
  constructor(private readonly appService:AppService){}
  create(createBbbDto: CreateBbbDto) {
    return 'This action adds a new bbb';
  }

  findAll() {
    return 'bbb'+this.appService.getHello()
    // return `This action returns all bbb`+this.aaaService.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} bbb`;
  }

  update(id: number, updateBbbDto: UpdateBbbDto) {
    return `This action updates a #${id} bbb`;
  }

  remove(id: number) {
    return `This action removes a #${id} bbb`;
  }
}
