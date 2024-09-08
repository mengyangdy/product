import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogsModule } from './logs/logs.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [LogsModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
