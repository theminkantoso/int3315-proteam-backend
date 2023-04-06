import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';

const port: number = parseInt(<string>process.env.PORT) || 3306;

export const mysqlConnectionConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  // host: 'localhost',
  host: process.env.ENVIRONMENT == 'docker'? process.env.DB_HOST: 'localhost',
  port: port,
  username: process.env.DB_USERNAME,
  password: process.env.ENVIRONMENT == 'docker'? process.env.DB_PASSWORD: '',
  database: process.env.DB_NAME,
//   entities: [ __dirname + 'dist/**/*.entity{.ts,.js}'],
  entities: [ __dirname + 'dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  timezone: '+07:00',
  autoLoadEntities: true,
};

export const mysqlConnectionAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'mysql',
      // host: 'localhost',
      host: process.env.DB_HOST,
      port: port,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      //   entities: [ __dirname + 'dist/**/*.entity{.ts,.js}'],
      entities: [ __dirname + 'dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      timezone: '+07:00',
      autoLoadEntities: true,
    };
  },
};