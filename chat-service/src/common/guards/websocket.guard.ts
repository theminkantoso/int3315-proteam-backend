import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/chat/services/user.service';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean | any | Promise<boolean | any>> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const authToken: any = client.handshake?.query?.token;
    try {
      const decoded = this.jwtService.verify(authToken);
      const user = await this.userService.getUserByEmail(decoded.email); // response to function
      context.switchToWs().getData().user = user;

      return user;
    } catch (ex) {
      return false;
    }
  }
}
