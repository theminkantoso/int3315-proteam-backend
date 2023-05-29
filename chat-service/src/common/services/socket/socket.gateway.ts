import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from 'src/common/guards/websocket.guard';
import { ISecureSocket } from './app.socket.gateway';

@WebSocketGateway({
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly configService: ConfigService) {
    // eslint-disable-next-line prettier/prettier
  }
  @WebSocketServer()
  server: Server;

  wsClients: ISecureSocket[] = [];

  afterInit(server: Server) {
    console.log('Init socket server', server);
  }

  @UseGuards(WsGuard)
  handleDisconnect(client: ISecureSocket) {
    console.log('socket-client disconnected');
    for (let i = 0; i < this.wsClients.length; i += 1) {
      if (this.wsClients[i].id === client.id) {
        this.wsClients.splice(i, 1);
        break;
      }
    }
  }

  @UseGuards(WsGuard)
  handleConnection(client: ISecureSocket) {
    console.log('socket-client connected');
    this.wsClients.push(client);
  }
}
