import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { SocketEvents } from '../../constants';
import { ISocketMessage, ISocketWepAppLogin } from '../../interfaces';
import { Socket } from 'socket.io';
import { ChatService } from 'src/chat/services/chat.service';
import { SocketGateway } from './socket.gateway';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from 'src/common/guards/websocket.guard';

export interface ISecureSocket extends Socket {
  loginUser: {
    account_id: number;
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
    client
      .to(`conversation-${payload.conversation_id}`)
      .emit(SocketEvents.WEB_APP_USER_RECEIVE_MESSAGE, payload);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.WEB_APP_USER_CREATE_CONVERSATION)
  async onClientCreateConversation(client: ISecureSocket, payload: any) {
    client.join(`conversation-${payload.conversation_id}`);
    payload?.users?.map((item) => {
      const clientUser = this.socketGateway.wsClients.find((client) => {
        return client.loginUser.account_id === item?.account_id;
      });
      if (clientUser) {
        clientUser.join(`conversation-${payload.conversation_id}`);
      }
    });
  }
}
