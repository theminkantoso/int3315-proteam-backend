import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {UserModule} from './users/user.module'
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConnectionAsyncConfig, mysqlConnectionConfig } from './config/mysql.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // TypeOrmModule.forRoot(mysqlConnectionConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(mysqlConnectionAsyncConfig),
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
