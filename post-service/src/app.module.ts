import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mysqlConnectionAsyncConfig, mysqlConnectionConfig } from './config/mysql.config';
import { PostModule } from './file/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // TypeOrmModule.forRoot(mysqlConnectionConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(mysqlConnectionAsyncConfig),
    PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}