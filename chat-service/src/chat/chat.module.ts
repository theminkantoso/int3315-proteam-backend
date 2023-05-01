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
import { User } from './entities/user.entity';
import { Conversation } from './entities/conversation.entity';
import { ConversationUser } from './entities/conversation_user.entity';
import { Message } from './entities/message.entity';
import { UserService } from './services/user.service';
import { ChatService } from './services/chat.service';
import { ChatController } from './chat.controller';
import { SocketInformation } from './entities/socket_information.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(ConfigKey.JWT_SECRET_ACCESS_TOKEN_KEY),
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      Conversation,
      ConversationUser,
      Message,
      SocketInformation,
    ]),
  ],
  providers: [UserService, ChatService, JwtGuard, DatabaseService],
  controllers: [ChatController],
  exports: [UserService, ChatService, JwtModule, JwtGuard],
})
export class ChatModule {}
