import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const port: number = 3306;

export const mysqlConnectionConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  // host: 'localhost',
  host: 'localhost',
  port: port,
  username: 'root',
  password: '',
  database: 'proteam',
  //   entities: [ __dirname + 'dist/**/*.entity{.ts,.js}'],
  entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  timezone: '+07:00',
  autoLoadEntities: true,
};