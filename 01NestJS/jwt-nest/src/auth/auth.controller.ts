import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  signin(@Body() dto:any) {
    const {username,password}=dto
    return this.authService.signin(username,password)
  }

  @Post('/signup')
  signup(@Body() dto:any) {
    const {username,password}=dto
    return this.authService.signup(username,password)
  }
}
