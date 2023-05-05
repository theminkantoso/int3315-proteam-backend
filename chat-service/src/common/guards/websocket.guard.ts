import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ConfigKey from '../config/config-key';
import { extractToken } from '../helper/commonFunction';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean | any | Promise<boolean | any>> {
    const request = context.switchToWs().getClient();
    const token = extractToken(request.handshake.headers.authorization || '');
    if (!token) {
      return false;
    }

    const loginUser = await this.validateToken(token);

    request.loginUser = {
      ...loginUser,
      account_id: loginUser?.id,
    };

    return true;
  }

  async validateToken(token: string) {
    try {
      return await this.jwtService.verify(token, {
        secret: this.configService.get(ConfigKey.JWT_SECRET_ACCESS_TOKEN_KEY),
        ignoreExpiration: false,
      });
    } catch (error) {
      throw error;
    }
  }
}
