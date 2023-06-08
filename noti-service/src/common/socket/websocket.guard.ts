import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  extractToken(authorization = '') {
    if (/^Bearer /.test(authorization)) {
      return authorization.substring(7, authorization.length);
    }
    return '';
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean | any | Promise<boolean | any>> {
    const request = context.switchToWs().getClient();
    const token = this.extractToken(
      request.handshake.headers.authorization || '',
    );
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
        secret: process.env.JWT_SECRET,
        ignoreExpiration: false,
      });
    } catch (error) {
      throw error;
    }
  }
}
