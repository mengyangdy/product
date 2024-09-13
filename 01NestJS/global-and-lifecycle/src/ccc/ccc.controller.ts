import { Controller, Get, Post, Body, Patch, Param, Delete, OnModuleInit, OnModuleDestroy, OnApplicationBootstrap } from '@nestjs/common';
import { CccService } from './ccc.service';
import { CreateCccDto } from './dto/create-ccc.dto';
import { UpdateCccDto } from './dto/update-ccc.dto';

@Controller('ccc')
export class CccController implements OnModuleInit,OnApplicationBootstrap {
  constructor(private readonly cccService: CccService) {}
  onModuleInit() {
    console.log("🚀 ~ file: ccc.controller.ts:10 ~ CccController ~ onModuleInit ~ onModuleInit~")
    
  }
  onApplicationBootstrap() {
    console.log("🚀 ~ file: ccc.controller.ts:14 ~ CccController ~ onApplicationBootstrap ~ onApplicationBootstrap~")
    
  }

  @Post()
  create(@Body() createCccDto: CreateCccDto) {
    return this.cccService.create(createCccDto);
  }

  @Get()
  findAll() {
    return this.cccService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cccService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCccDto: UpdateCccDto) {
    return this.cccService.update(+id, updateCccDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cccService.remove(+id);
  }
}
