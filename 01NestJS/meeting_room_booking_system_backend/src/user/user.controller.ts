import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  UnauthorizedException,
  ParseIntPipe,
  BadRequestException, DefaultValuePipe, UseInterceptors, UploadedFile
} from "@nestjs/common";
import { UserService } from "./user.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { EmailService } from "../email/email.service";
import { RedisService } from "../redis/redis.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RequireLogin, UserInfo } from "../custom.decorator";
import { UserDetailVo } from "./vo/user-info.vo";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { generateParseIntPipe } from "../utils";
import { FileInterceptor } from "@nestjs/platform-express";
import * as path from 'path';
import { storage } from "../my-file-storage";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Post()
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Get("register-captcha")
  async captcha(@Query("address") address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);
    await this.emailService.sendMail({
      to: address,
      subject: "注册验证码",
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return "发送成功";
  }

  @Get("init-data")
  async initData() {
    await this.userService.initData();
    return "done";
  }

  @Post()
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);

    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get("jwt_access_token_expires_time") || "30m",
      },
    );

    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get("jwt_refresh_token_expres_time") || "7d",
      },
    );

    return vo;
  }

  @Post("admin/login")
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get("jwt_access_token_expires_time") || "30m",
      },
    );

    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get("jwt_refresh_token_expres_time") || "7d",
      },
    );
    return vo;
  }

  @Get()
  async refresh(@Query("refreshToken") refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId, false);

      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get("jwt_access_token_expires_time") || "30m",
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get("jwt_refresh_token_expres_time") || "7d",
        },
      );
      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException("token 已失效，请重新登录");
    }
  }

  @Get("admin/refresh")
  async adminRefresh(@Query("refreshToken") refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, true);

      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get("jwt_access_token_expires_time") || "30m",
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get("jwt_refresh_token_expres_time") || "7d",
        },
      );

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException("token 已失效，请重新登录");
    }
  }

  @Get()
  @RequireLogin()
  async info(@UserInfo("userId") userId: number) {
    const user = await this.userService.findUserDetailById(userId);
    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.email = user.email;
    vo.username = user.username;
    vo.headPic = user.headPic;
    vo.phoneNumber = user.phoneNumber;
    vo.nickName = user.nickName;
    vo.createTime = user.createTime;
    vo.isFrozen = user.isFrozen;

    return vo;
  }

  @Post(["update_password", "admin/update_password"])
  async updatePassword(
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(passwordDto);
  }

  @Get("update_password/captcha")
  async updatePasswordCaptcha(@Query("address") address: String) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(
      `update_password_captcha_${address}`,
      code,
      10 * 60,
    );
    await this.emailService.sendMail({
      to: address,
      subject: "更改密码验证码",
      html: `<p>你的更改密码验证码是 ${code}</p>`,
    });
    return "发送成功";
  }

  @Post(["update", "admin/update"])
  @RequireLogin()
  async update(
    @UserInfo("userId") userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, updateUserDto);
  }

  @Get("update/captcha")
  async updateCaptcha(@Query("address") address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(
      `update_user_captcha_${address}`,
      code,
      10 * 60,
    );

    await this.emailService.sendMail({
      to: address,
      subject: "更改用户信息验证码",
      html: `<p>你的验证码是 ${code}</p>`,
    });
    return "发送成功";
  }

  @Get("freeze")
  async freeze(@Query("id") userId: number) {
    await this.userService.freezeUserById(userId);
  }

  @Get("list")
  async list(
    @Query("pageNo",new DefaultValuePipe(1), generateParseIntPipe("pageNo")) pageNo: number,
    @Query("pageSize",new DefaultValuePipe(2), generateParseIntPipe("pageSize")) pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string
  ) {
    return await this.userService.findUsersByPage(username, nickName, email, pageNo, pageSize);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    dest: 'uploads',
    storage:storage,
    limits:{
      fileSize:1024*1024*3
    },
    fileFilter(req,file,callback){
      const extname=path.extname(file.originalname)
      if(['.png','.jpg','.gif'].includes(extname)){
        callback(null,true)
      }else{
        callback(new BadRequestException('只能上传图片'),false)
      }
    }
  }))
  uploadFile(@UploadedFile() file:Express.Multer.File){
    return file.path
  }
}
