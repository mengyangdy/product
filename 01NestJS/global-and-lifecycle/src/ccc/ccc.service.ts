import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { CreateCccDto } from './dto/create-ccc.dto';
import { UpdateCccDto } from './dto/update-ccc.dto';

@Injectable()
export class CccService implements OnModuleInit, OnApplicationBootstrap {
  onModuleInit() {
    console.log(
      '🚀 ~ file: ccc.service.ts:8 ~ CccService ~ onModuleInit ~ onModuleInit~',
    );
  }
  onApplicationBootstrap() {
    console.log(
      '🚀 ~ file: ccc.service.ts:12 ~ CccService ~ onApplicationBootstrap ~ onApplicationBootstrap~',
    );
  }
  create(createCccDto: CreateCccDto) {
    return 'This action adds a new ccc';
  }

  findAll() {
    return `This action returns all ccc`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ccc`;
  }

  update(id: number, updateCccDto: UpdateCccDto) {
    return `This action updates a #${id} ccc`;
  }

  remove(id: number) {
    return `This action removes a #${id} ccc`;
  }
}
