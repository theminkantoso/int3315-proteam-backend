import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mysqlConnectionConfig } from './config/mysql.config';
import { PostModule } from './file/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(mysqlConnectionConfig),
    PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}