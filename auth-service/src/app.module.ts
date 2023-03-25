import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import envSchema from 'src/common/config/validation-schema';
import { WinstonModule } from './common/services/winston.service';
import { HeaderMiddleware } from './common/middleware.ts/header.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { MySqlModule } from './common/services/mysql.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './modules/common/common.module';
import { FileModule } from './modules/file/file.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            validationSchema: envSchema,
        }),
        ScheduleModule.forRoot(),
        WinstonModule,
        MySqlModule,
        AuthModule,
        CommonModule,
        FileModule,
    ],
    controllers: [AppController],
    providers: [],
    exports: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HeaderMiddleware).forRoutes('*');
    }
}
