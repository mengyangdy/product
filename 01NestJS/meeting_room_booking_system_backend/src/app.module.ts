import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { User } from "./user/entities/user.entity";
import { Role } from "./user/entities/role.entity";
import { Permission } from "./user/entities/permission.entity";
import { RedisModule } from "./redis/redis.module";
import { EmailModule } from "./email/email.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { LoginGuard } from "./login.guard";
import { PermissionGuard } from "./permission.guard";
import { MeetingRoomModule } from './meeting-room/meeting-room.module';
import { MeetingRoom } from "./meeting-room/entities/meeting-room.entity";
import { BookingModule } from './booking/booking.module';
import { Booking } from "./booking/entities/booking.entity";
import {WinstonModule,WinstonLogger,utilities} from "nest-winston";
import * as winston from 'winston'

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get("jwt_secret"),
          signOptions: {
            expiresIn: "30m",
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "src/.env",
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: "mysql",
          host: configService.get("mysql_server_host"),
          port: configService.get("mysql_server_port"),
          username: configService.get("mysql_server_username"),
          password: configService.get("mysql_server_password"),
          database: configService.get("mysql_server_database"),
          synchronize: true,
          logging: true,
          entities: [User, Role, Permission,MeetingRoom,Booking],
          poolSize: 10,
          connectorPackage: "mysql2",
        };
      },
    }),
    WinstonModule.forRootAsync({
      useFactory:()=>({
        level:'debug',
        transports:[
          new winston.transports.File({
            filename:`${process.cwd()}/log`
          }),
          new winston.transports.Console({
            format:winston.format.combine(winston.format.timestamp(),utilities.format.nestLike())
          })
        ]
      })
    }),
    UserModule,
    RedisModule,
    EmailModule,
    MeetingRoomModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide:APP_GUARD,
      useClass:PermissionGuard
    }
  ],
})
export class AppModule {}
