import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FormatResponseInterceptor } from "./format-response.interceptor";
import { InvokeRecordInterceptor } from "./invoke-record.interceptor";
import { UnloginFilter } from "./unlogin.filter";
import { CustomExceptionFilter } from "./custom-exception.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('uploads',{
    prefix:'/uploads'
  })
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new FormatResponseInterceptor())
  app.useGlobalInterceptors(new InvokeRecordInterceptor())
  // app.useGlobalFilters(new UnloginFilter())
  app.useGlobalFilters(new CustomExceptionFilter())

  const config=new DocumentBuilder().setTitle('会议室预定系统').setDescription('api接口文档').setVersion('1.0').build()
  const document=SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('api-doc',app,document)

  const configService=app.get(ConfigService)

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
