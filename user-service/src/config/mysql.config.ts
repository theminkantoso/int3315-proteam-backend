import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const port: number = parseInt(<string>process.env.PORT) || 3306;

export const mysqlConnectionConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '',
  database: 'proteam',
//   entities: [ __dirname + 'dist/**/*.entity{.ts,.js}'],
  entities: [ __dirname + 'dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  timezone: '+07:00',
  autoLoadEntities: true,
};