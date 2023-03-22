import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const port: number = parseInt(<string>process.env.PORT) || 3306;

export const mysqlConnectionConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: port,
  username: 'root',
  password: '123456',
  database: 'proteam',
//   entities: [ __dirname + 'dist/**/*.entity{.ts,.js}'],
  entities: [ __dirname + 'dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  timezone: 'utc',
  autoLoadEntities: true,
};