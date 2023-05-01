import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConnectionAsyncConfig, mysqlConnectionConfig } from './config/mysql.config';
import { NotiModule } from './file/noti.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
  // TypeOrmModule.forRoot(mysqlConnectionConfig),
  ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync(mysqlConnectionAsyncConfig),
  NotiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
