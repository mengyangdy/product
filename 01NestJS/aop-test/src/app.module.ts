import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogMiddleware } from './log.middleware';
import { AaaModule } from './aaa/aaa.module';
import { BbbModule } from './bbb/bbb.module';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './login.guard';

@Module({
  imports: [AaaModule, BbbModule],
  controllers: [AppController],
  // 这也是一种使用全局守卫的方法
  providers: [AppService, { provide: APP_GUARD, useClass: LoginGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // 这是路由中间件的写法 只有a路由可以访问到
    consumer.apply(LogMiddleware).forRoutes('aaa*');
  }
}
