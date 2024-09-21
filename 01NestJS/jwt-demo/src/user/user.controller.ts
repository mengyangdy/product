import {
  Controller,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../custom.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('list')
  findAll() {
    return this.userService.findAll();
  }
}
