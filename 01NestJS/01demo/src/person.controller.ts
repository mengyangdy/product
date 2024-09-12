import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post('file')
  @UseInterceptors(AnyFilesInterceptor({
    dest:'uploads/'
  }))
  getFile(@Body() data:any, @UploadedFiles() files:Array<Express.Multer.File>){
    return data
  }

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return `${JSON.stringify(createPersonDto)}`
  }

  @Get()
  findAll() {
    return this.personService.findAll();
  }
  @Get('find')
  find(@Query('name') name:string,@Query('age') age:string) {
    return `received ${name}   ${age}`
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `received :id=${id}`
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
