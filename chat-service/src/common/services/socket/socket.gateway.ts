import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';

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

  wsClients = [];

  afterInit(server: Server) {
    console.log('Init socket server', server);
  }

  handleDisconnect(client: Socket) {
    for (let i = 0; i < this.wsClients.length; i += 1) {
      if (this.wsClients[i].id === client.id) {
        this.wsClients.splice(i, 1);
        break;
      }
    }
  }

  handleConnection(client: Socket) {
    this.wsClients.push(client);
  }
}
