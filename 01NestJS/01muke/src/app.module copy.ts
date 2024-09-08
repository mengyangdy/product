import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import configuration from './configuration';
import * as config from 'config'
import * as dotenv from 'dotenv'
import * as Joi from 'joi'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEnum } from './enum';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Profile } from './user/entities/profile.entity'
import { RolesModule } from './roles/roles.module';
import { LogsModule } from './logs/logs.module';
import { Roles } from './roles/entities/role.entity';
import { Logs } from './logs/entities/log.entity';
import { join } from 'path';
import { LoggerModule } from 'nestjs-pino';
console.log(config.get('name'));


// const envFilePath=`.env.${process.env.NODE_ENV || 'development'}`

/**
 * 使用Module组织应用程序
 * @Module装饰器描述模块
 * 模块中有四大属性：imports controllers providers exports
 */
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    // envFilePath
    // load:[configuration]
    // load:[()=>dotenv.config({path:".env"})]
    validationSchema: Joi.object({
      DB_PORT: Joi.number().default(3306),
      DB_HOST: Joi.number().valid(3306, 3307, 3308),
      NODE_ENV: Joi.string().valid('development', 'production').default('development'),
      DB_URL: Joi.string()
    })
  }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'mysql',
    //     host: configService.get(ConfigEnum.NAME),
    //     port: 3306,
    //     username: 'root',
    //     password: 'MENGyang110.',
    //     database: 'test',
    //     entities: [],
    //     // 同步本地的schema与数据库 ==> 初始化的时候去使用 如果已有数据库千万不能用！
    //     synchronize: true,
    //     logging: ['error']
    //   })
    // }),
    UserModule,
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: '124.70.223.245',
    port: 3306,
    username: 'root',
    password: 'MENGyang110.',
    database: 'test',
    entities: [User, Profile, Roles, Logs],
    // 同步本地的schema与数据库 ==> 初始化的时候去使用 如果已有数据库千万不能用！
    synchronize: true,
    // logging: ['error'],
    logging: process.env.NODE_ENV === 'development'
  }),
    RolesModule,
    LogsModule,
  LoggerModule.forRoot({
    pinoHttp: {
      transport: {
        targets: [
          {
            level: 'info',
            target: 'pino-pretty',
            options: {
              colorize: true
            }
          },
          {
            level: 'info',
            target: 'pino-roll',
            options: {
              file: join('log', 'log.txt'),
              frequency: 'daily',// hourly
              size: '0.1k',// 滚动文件的大小 大于这个数字就创建新的文件
              madir: true
            }
          }
        ]
      }
      // transport:
      // process.env.NODE_ENV === 'development'?
      // {
      //   target:'pino-pretty',
      //   options:{
      //     colorize:true
      //   }
      // }
      // :{
      //   target:'pino-roll',
      //   options:{
      //     file:'log.txt',
      //     frequency:'daily',
      //     madir:true
      //   }
      // }
    }
  })
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: []
})
export class AppModule { }
