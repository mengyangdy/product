import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger } from 'winston';
import * as winston from 'winston'
import { utilities, WinstonModule } from 'nest-winston';
import 'winston-daily-rotate-file'
import { HttpExceptionFilter } from './filters/http-exception.filter';


async function bootstrap() {
  const instance = createLogger({
    transports: [new winston.transports.Console({
      level:'info',
      format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike())
    }),new winston.transports.DailyRotateFile({
      level:'warn',
      dirname:'logs',
      filename:'application-%DATE%.log',
      datePattern:'YYYY-MM_DD_HH',
      zippedArchive:true,
      maxSize:'20m',
      maxFiles:'14d',
      format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike())
    }),new winston.transports.DailyRotateFile({
      level:'error',
      dirname:'logs',
      filename:'error-%DATE%.log',
      datePattern:'YYYY-MM_DD_HH',
      zippedArchive:true,
      maxSize:'20m',
      maxFiles:'14d',
      format: winston.format.combine(winston.format.timestamp(), winston.format.simple())
    })]
  })

  const logger=WinstonModule.createLogger({
    instance
  })

  const app = await NestFactory.create(AppModule, {
    // 关闭整个nestjs的日志
    // logger:false
    // logger:['error','warn']
    logger: logger
  });
  app.setGlobalPrefix('api/v1')
  app.useGlobalFilters(new HttpExceptionFilter(logger))
  const port = 3000
  await app.listen(port);

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
bootstrap();
