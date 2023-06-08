import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebAppGateway } from './common/socket/app.socket.gateway';
import { SocketGateway } from './common/socket/socket.gateway';
import { mysqlConnectionAsyncConfig } from './config/mysql.config';
import { NotiModule } from './noti/noti.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(mysqlConnectionAsyncConfig),
    NotiModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway, WebAppGateway],
})
export class AppModule {}
