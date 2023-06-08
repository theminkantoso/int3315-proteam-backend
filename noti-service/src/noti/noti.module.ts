import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RmqModule } from '../common/rabbit/rabbitmq.module';
import { JwtStrategy } from 'src/common';
import { NotiService } from './services/noti.service';
import { NotiController } from './controllers/noti.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { Noti } from './entities/noti.entities';
import { User } from './entities/user.entities';
import { Post } from './entities/post.entities';
import { FriendFollow } from './entities/friend_follow.entities';
import { NotiToken } from './entities/noti_token.entities';
import { ConversationUser } from './entities/conversation_user.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/entities/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_NOTI_QUEUE: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forFeature([
      Noti,
      Post,
      User,
      ConversationUser,
      FriendFollow,
      NotiToken,
      Notification,
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: 's@cret',
      }),
    }),
    RmqModule,
  ],
  controllers: [NotiController],
  providers: [JwtService, JwtStrategy, NotiService, NotificationService],
  exports: [NotiModule, NotiService, JwtService, JwtStrategy],
})
export class NotiModule {}
