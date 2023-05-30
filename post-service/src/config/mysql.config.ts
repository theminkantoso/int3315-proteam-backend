import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';

const port: number = parseInt(<string>process.env.PORT) || 3306;

const environment = process.env.ENVIRONMENT;

const databaseConfig = {
  host: environment === 'prod' ? process.env.DB_HOST : 'localhost',
  password: environment === 'prod' ? process.env.DB_PASSWORD : '',
  username: environment === 'prod' ? process.env.DB_USER : 'root',
  database: environment === 'prod' ? process.env.DB_DATABASE : 'proteam',
};

export const mysqlConnectionAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'mysql',
      port: port,
      ...databaseConfig,
      entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      timezone: '+07:00',
      autoLoadEntities: true,
    };
  },
};
