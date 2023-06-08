import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { SocketGateway } from './socket.gateway';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from 'src/common/socket/websocket.guard';
import { SocketEvents } from '../constants';
import { ISocketMessage, ISocketWepAppLogin } from '../interfaces';
import { NotiService } from 'src/noti/services/noti.service';
import { NotificationService } from 'src/notification/notification.service';
import { Constant } from 'src/noti/constants/message';

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
    private readonly notiService: NotiService,
    private readonly notificationService: NotificationService,
  ) {
    // eslint-disable-next-line prettier/prettier
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.WEB_APP_USER_LOGIN)
  async onWebAppLogin(client: ISecureSocket, payload: ISocketWepAppLogin) {
    // listen the event when a user login to web app
    if (payload.senderId) {
      const conversationUsers =
        await this.notiService.getAllConversationUserByUserId(payload.senderId);
      conversationUsers?.forEach((item) => {
        client.join(`conversation-${item.conversation_id}`);
      });
    }
  }

  // emit event

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.WEB_APP_USER_SENT_MESSAGE)
  async onClientSentMessage(client: ISecureSocket, payload: ISocketMessage) {
    console.log(
      `user ${client.loginUser?.email} send message to conversation ${payload.conversation_id}`,
    );
    client
      .to(`conversation-${payload.conversation_id}`)
      .emit(SocketEvents.WEB_APP_USER_RECEIVE_MESSAGE, payload);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.WEB_APP_USER_CREATE_CONVERSATION)
  async onClientCreateConversation(client: ISecureSocket, payload: any) {
    // log
    console.log(`user ${client.loginUser?.email} create conversation `);

    // create notification
    let insertNotification = [];

    // create room
    payload?.users?.map((item) => {
      if (item?.user_id !== client.loginUser?.account_id) {
        insertNotification.push({
          account_id: item?.user_id,
          description: `${Constant.ADDED_TO_CONVERSATION} ${client.loginUser?.email}`,
          is_read: false,
          create_time: new Date(),
          type: 'chat_service',
        });
      }
      const clientUser = this.socketGateway.wsClients.find((clientUser) => {
        return clientUser.loginUser?.account_id == item?.user_id;
      });
      if (clientUser) {
        clientUser.join(`conversation-${payload.id}`);
      }
    });

    await this.notificationService.bulkCreate(insertNotification);

    // emit event
    client
      .to(`conversation-${payload.id}`)
      .emit(SocketEvents.WEB_APP_USER_ADDED_CONVERSATION, {});
  }
}
