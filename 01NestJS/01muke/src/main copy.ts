import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger=new Logger()
  const app = await NestFactory.create(AppModule,{
    // 关闭整个nestjs的日志
    // logger:false
    // logger:['error','warn']
  });
  app.setGlobalPrefix('api/v1')
  const port=3000
  await app.listen(port);
  logger.warn(`app ${port}`)
  if(module.hot){
    module.hot.accept()
    module.hot.dispose(()=>app.close())
  }
}
bootstrap();
