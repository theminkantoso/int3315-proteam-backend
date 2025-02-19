import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import ConfigKey from 'src/common/config/config-key';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { DatabaseService } from 'src/common/services/mysql.service';
import { AuthController } from './auth.controller';
import { RefreshTokenMiddleware } from './auth.middleware';
import { UserToken } from './entities/user-token.entity';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(ConfigKey.JWT_SECRET_ACCESS_TOKEN_KEY),
        signOptions: {
          expiresIn: configService.get(ConfigKey.TOKEN_EXPIRED_IN),
        },
      }),
    }),
    TypeOrmModule.forFeature([User, UserToken]),
  ],
  providers: [AuthService, JwtGuard, DatabaseService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, JwtGuard],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes({
      path: '/auth/refresh-token',
      method: RequestMethod.POST,
    });
  }
}
