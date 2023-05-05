import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { SocketEvents } from '../../constants';
import { ISocketMessage, ISocketWepAppLogin } from '../../interfaces';
import { Socket } from 'socket.io';
import { ChatService } from 'src/chat/services/chat.service';
import { SocketGateway } from './socket.gateway';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from 'src/common/guards/websocket.guard';

interface ISecureSocket extends Socket {
  loginUser: {
    id: number;
    email: string;
    role: string;
    expiresIn: number;
  };
}
@WebSocketGateway({
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
})
export class WebAppGateway {
  constructor(
    private readonly configService: ConfigService,
    private readonly socketGateway: SocketGateway,
    private readonly chatService: ChatService,
  ) {
    // eslint-disable-next-line prettier/prettier
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.WEB_APP_USER_LOGIN)
  async onWebAppLogin(client: ISecureSocket, payload: ISocketWepAppLogin) {
    // listen the event when a user login to web app
    if (payload.senderId) {
      //
      const conversationUsers =
        await this.chatService.getAllConversationUserByUserId(payload.senderId);
      conversationUsers?.forEach((item) => {
        client.join(`conversation-${item.conversation_id}`);
      });
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.WEB_APP_USER_SENT_MESSAGE)
  async onClientSentMessage(client: ISecureSocket, payload: ISocketMessage) {
    console.log('client', client?.loginUser);
    console.log('payload', payload);
  }
}
