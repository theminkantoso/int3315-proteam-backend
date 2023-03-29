import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import ConfigKey from 'src/common/config/config-key';
import { generateHashToken } from 'src/common/helper/commonFunction';
import { EntityManager, Repository } from 'typeorm';
import { ChangePasswordDto } from '../dto/requests/update-profile.dto';
import { UserToken } from '../entities/user-token.entity';
import bcrypt from 'bcrypt';
import { DatabaseService } from 'src/common/services/mysql.service';
import { OAuth2Client, TokenInfo } from 'google-auth-library';
import { IGoogleLoginLinkQuery } from '../auth.interfaces';
import { GoogleLoginLinkParameters } from '../auth.constants';
import { User } from '../entities/user.entity';

export const usersAttributes: (keyof User)[] = ['email', 'role', 'account_id'];

@Injectable()
export class AuthService {
  constructor(
    @InjectEntityManager()
    private readonly dbManager: EntityManager,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   *
   * @param user
   * @return accessToken & accessTokenExpiredIn
   */
  private generateAccessToken(user: User) {
    const accessTokenExpiredIn = this.configService.get(
      ConfigKey.TOKEN_EXPIRED_IN,
    );
    const secretAccessTokenKey = this.configService.get(
      ConfigKey.JWT_SECRET_ACCESS_TOKEN_KEY,
    );
    const accessTokenOptions = {
      secret: secretAccessTokenKey,
      expiresIn: accessTokenExpiredIn,
    };
    const payloadAccessToken = {
      id: user.account_id,
      email: user.email,
      role: user.role,
      expiresIn: accessTokenExpiredIn,
    };
    const accessToken = this.jwtService.sign(
      payloadAccessToken,
      accessTokenOptions,
    );
    return {
      token: accessToken,
      expiresIn: accessTokenExpiredIn,
    };
  }

  /**
   *
   * @param user
   * @param hashToken
   * @return refreshToken && refreshTokenExpiredIn
   */
  private generateRefreshToken(user: User, hashToken: string) {
    const refreshTokenExpiredIn = this.configService.get(
      ConfigKey.REFRESH_TOKEN_EXPIRED_IN,
    );
    const secretRefreshTokenKey = this.configService.get(
      ConfigKey.JWT_SECRET_REFRESH_TOKEN_KEY,
    );
    const accessTokenOptions = {
      secret: secretRefreshTokenKey,
      expiresIn: refreshTokenExpiredIn,
    };

    const payloadAccessToken = {
      id: user.account_id,
      email: user.email,
      role: user.role,
      expiresIn: refreshTokenExpiredIn,
      hashToken,
    };
    const refreshToken = this.jwtService.sign(
      payloadAccessToken,
      accessTokenOptions,
    );
    return {
      token: refreshToken,
      expiresIn: refreshTokenExpiredIn,
    };
  }

  public async login(user: User) {
  // public login(user: User) {
    try {
      const accessToken = this.generateAccessToken(user);
      console.log("AVSSS");
      console.log(accessToken);
      console.log("async", user);
      const hashToken = generateHashToken(user.account_id);
      console.log(hashToken);
      const refreshToken = this.generateRefreshToken(user, hashToken);

      await this.dbManager.transaction(async (transactionManager) => {
        // add refresh token to user_tokens table.
        await this.userTokenRepository.save({
          user,
          token: refreshToken.token,
          hashToken,
        });
      });

      console.log("222", accessToken);
      console.log("222", user.email);

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log("Hi", error);
      throw error;
    }
  }

  public async logout(user: User): Promise<boolean> {
    try {
      // delete old refresh token
      await this.userTokenRepository.delete({ account_id: user.account_id });
      return true;
    } catch (error) {
      throw error;
    }
  }

  public async getUserByEmail(email: string, attributes = usersAttributes) {
    try {
      const user = await this.userRepository.findOne({
        select: attributes,
        where: { email },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async changePassword(body: ChangePasswordDto, id: number) {
    try {
      body.newPassword = bcrypt.hashSync(
        body.newPassword,
        bcrypt.genSaltSync(10),
      );

      await this.userRepository.update(id, {
        password: body.newPassword,
      });

      const savedUser = await this.userRepository.findOne({
        where: { account_id: id },
      });
      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  public async checkHashToken(token: string) {
    try {
      const data = await this.jwtService.verify(token, {
        secret: this.configService.get(ConfigKey.JWT_SECRET_REFRESH_TOKEN_KEY),
      });
      const res = await this.databaseService.checkItemExist(
        UserToken,
        'hashToken',
        data.hashToken,
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  public async refreshToken(user: User) {
    try {
      const accessToken = this.generateAccessToken(user);
      const hashToken = generateHashToken(user.account_id);
      const refreshToken = this.generateRefreshToken(user, hashToken);
      await this.dbManager.transaction(async (transactionManager) => {
        // delete old refresh token
        await this.dbManager.delete(UserToken, { user });
        // add refresh token to user_tokens table.
        await transactionManager.save(UserToken, {
          user,
          token: refreshToken.token,
          hashToken,
        });
      });
      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getAccessTokenFromCode(
    decodedCode: string,
    redirectUri: string,
  ) {
    try {
      const clientSecret = this.configService.get(
        ConfigKey.GOOGLE_CLIENT_SECRET,
      );
      const clientId = this.configService.get(ConfigKey.GOOGLE_CLIENT_ID);
      const googleClient = new OAuth2Client({ clientSecret, clientId });
      const result = await googleClient.getToken({
        code: decodedCode,
        redirect_uri: redirectUri,
      });

      return result?.tokens?.access_token || '';
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async getUserInfoFromAccessToken(accessToken: string) {
    try {
      const clientSecret = this.configService.get(
        ConfigKey.GOOGLE_CLIENT_SECRET,
      );
      const clientId = this.configService.get(ConfigKey.GOOGLE_CLIENT_ID);
      const googleClient = new OAuth2Client({ clientSecret, clientId });
      const infoUser: TokenInfo = await googleClient.getTokenInfo(accessToken);
      return infoUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public getGoogleLink(
    query: IGoogleLoginLinkQuery,
    scope = GoogleLoginLinkParameters.scope,
    responseType = GoogleLoginLinkParameters.responseType,
    accessType = GoogleLoginLinkParameters.accessType,
    prompt = GoogleLoginLinkParameters.prompt,
  ) {
    try {
      const clientSecret = this.configService.get(
        ConfigKey.GOOGLE_CLIENT_SECRET,
      );
      const clientId = this.configService.get(ConfigKey.GOOGLE_CLIENT_ID);
      const googleClient = new OAuth2Client({ clientSecret, clientId });
      const googleLoginUrl = googleClient.generateAuthUrl({
        state: query.state,
        redirect_uri: query.redirectUri,
        scope,
        response_type: responseType,
        access_type: accessType,
        prompt,
      });
      return googleLoginUrl;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
