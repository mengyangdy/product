import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局拦截器
  app.useGlobalPipes(new ValidationPipe({
    // 去除在雷伤不存在的字段
    // whitelist:true
  }))
  await app.listen(3000);
}
bootstrap();
