import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const port: number = parseInt(<string>process.env.PORT) || 3306;
                const mysqlConnectionConfig: TypeOrmModuleOptions = {
                    type: 'mysql',
                    // host: 'localhost',
                    host: 'mysql',
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
                return mysqlConnectionConfig;
            },
        }),
    ],
    providers: [],
    exports: [],
})
export class MySqlModule {}
