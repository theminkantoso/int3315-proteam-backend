import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RmqModule } from '../common/rabbit/rabbitmq.module';
import { JwtStrategy } from 'src/common';
import { NotiService } from './services/noti.service';
import { NotiController } from './controllers/noti.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { Noti } from './entities/noti.entities';
import { User } from './entities/user.entities';
import { Post } from './entities/post.entity';
import { FriendFollow } from './entities/friend_follow.entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_NOTI_QUEUE: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forFeature([Noti, Post, User, FriendFollow]),
    JwtModule.register({}),
    RmqModule,
  ],
  controllers: [NotiController],
  providers: [JwtService, JwtStrategy, NotiService],
  exports: [NotiModule],
})
export class NotiModule {}
