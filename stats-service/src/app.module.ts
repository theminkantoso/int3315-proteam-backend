import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsModule } from './stats/stats.module';
import { mysqlConnectionAsyncConfig } from './config/mysql.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(mysqlConnectionAsyncConfig),
    StatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
