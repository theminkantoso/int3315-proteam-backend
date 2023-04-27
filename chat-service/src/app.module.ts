import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConnectionConfig } from './config/mysql.config';
import { ChatModule } from './chat/chat.module';
import { SocketGateway } from './common/services/socket/socket.gateway';
import { WebAppGateway } from './common/services/socket/app.socket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(mysqlConnectionConfig),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway, WebAppGateway],
})
export class AppModule {}
