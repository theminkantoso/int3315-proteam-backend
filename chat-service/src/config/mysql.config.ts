import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
dotenv.config();

const port = parseInt(process.env.PORT) || 3306;
const environment = process.env.NODE_ENV;

const databaseConfig = {
  host: environment === 'prod' ? process.env.DB_HOST : 'localhost',
  password: environment === 'prod' ? process.env.DB_PASSWORD : '',
  username: environment === 'prod' ? process.env.DB_USER : 'root',
  database: environment === 'prod' ? process.env.DB_DATABASE : 'proteam',
};

export const mysqlConnectionConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  ...databaseConfig,
  port: port,
  entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  timezone: '+07:00',
  autoLoadEntities: true,
};
