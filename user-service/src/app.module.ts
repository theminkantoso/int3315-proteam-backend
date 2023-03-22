import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {UserModule} from './users/user.module'
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConnectionConfig } from './config/mysql.config';

@Module({
  imports: [TypeOrmModule.forRoot(mysqlConnectionConfig),
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
