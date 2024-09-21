import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService,private jwtService:JwtService) {}

  async signIn(username: string, pass: string) {
    const user = await this.userService.findOne('mengyang');

    if (user?.password !== pass) {
      throw new UnauthorizedException('密码错误');
    }

    const payload = { sub: user.userId, username: user.username };
    // TODO: 生成一个 JWT，并在这里返回
    // 而不是返回一个用户对象
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
