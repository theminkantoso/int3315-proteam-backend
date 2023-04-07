import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { OAuth2Client, TokenInfo } from 'google-auth-library';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';
import ConfigKey from 'src/common/config/config-key';
import { generateHashToken } from 'src/common/helper/commonFunction';
import { DatabaseService } from 'src/common/services/mysql.service';
import { EntityManager, Repository } from 'typeorm';
import { GoogleLoginLinkParameters, UserTokenType } from '../auth.constants';
import { ICreateUserBody, IGoogleLoginLinkQuery } from '../auth.interfaces';
import { ChangePasswordDto } from '../dto/requests/update-profile.dto';
import { UserToken } from '../entities/user-token.entity';
import { User } from '../entities/user.entity';
import nodemailer from 'nodemailer';

export const usersAttributes: (keyof User)[] = [
  'email',
  'role',
  'account_id',
  'name',
  'gpa',
  'school',
  'major',
  'linkedln_link',
  'phone',
];

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
   * @param account_id
   * @return resetString and resetPasswordExpiredIn
   */
  private generateResetString(user: User) {
    const resetPasswordExpiredIn = this.configService.get(
      ConfigKey.TOKEN_EXPIRED_IN,
    );
    const secretResetPasswordKey = this.configService.get(
      ConfigKey.JWT_SECRET_ACCESS_TOKEN_KEY,
    );
    const resetPasswordOptions = {
      secret: secretResetPasswordKey,
      expiresIn: resetPasswordExpiredIn,
    };
    const payloadAccessToken = {
      id: user.account_id,
      email: user.email,
      role: user.role,
      expiresIn: resetPasswordExpiredIn,
    };
    const resetString = this.jwtService.sign(
      payloadAccessToken,
      resetPasswordOptions,
    );
    return {
      resetString: resetString,
      expiresIn: resetPasswordExpiredIn,
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
    try {
      const accessToken = this.generateAccessToken(user);
      const hashToken = generateHashToken(user.account_id);
      const refreshToken = this.generateRefreshToken(user, hashToken);
      await this.dbManager.transaction(async (transactionManager) => {
        // add refresh token to user_tokens table.
        await this.userTokenRepository.save({
          account_id: user.account_id,
          token: refreshToken.token,
          hash_token: hashToken,
          type: UserTokenType.REFRESH_TOKEN,
        });
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      // console.log(error);
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

  public async getUserById(id: number, attributes = usersAttributes) {
    try {
      const user = await this.userRepository.findOne({
        select: attributes,
        where: { account_id: id },
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

  public async getIdTokenFromCode(decodedCode: string, redirectUri: string) {
    try {
      const clientSecret = this.configService.get(
        ConfigKey.GOOGLE_CLIENT_SECRET,
      );
      const clientId = this.configService.get(ConfigKey.GOOGLE_CLIENT_ID);
      const googleClient = new OAuth2Client({ clientSecret, clientId });
      const result: GetTokenResponse = await googleClient.getToken({
        code: decodedCode,
        redirect_uri: redirectUri,
      });

      return result?.tokens?.id_token || '';
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

  public async getUserInfoFromIdToken(idToken: string) {
    try {
      const clientSecret = this.configService.get(
        ConfigKey.GOOGLE_CLIENT_SECRET,
      );
      const clientId = this.configService.get(ConfigKey.GOOGLE_CLIENT_ID);
      const googleClient = new OAuth2Client({ clientSecret, clientId });

      const infoUser = await googleClient.verifyIdToken({ idToken });
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

  public async saveGoogleUser(userData: ICreateUserBody) {
    try {
      const newUser = this.userRepository.save(userData);
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async sendEmailToResetPassword(user: User, redirectUri: string) {
    try {
      const adminEmail = this.configService.get(ConfigKey.EMAIL);
      const refreshTokenGmail = this.configService.get(
        ConfigKey.REFRESH_TOKEN_GMAIL,
      );
      const clientSecret = this.configService.get(
        ConfigKey.GOOGLE_CLIENT_SECRET,
      );
      const clientId = this.configService.get(ConfigKey.GOOGLE_CLIENT_ID);
      const googleClient = new OAuth2Client({ clientSecret, clientId });
      googleClient.setCredentials({ refresh_token: refreshTokenGmail });

      const myAccessTokenObj = await googleClient.getAccessToken();
      const myAccessToken = myAccessTokenObj?.token;

      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: adminEmail,
          clientId,
          clientSecret,
          refreshToken: refreshTokenGmail,
          accessToken: myAccessToken,
        },
      });

      // calculate data to include in email content
      const userId = user.account_id;
      const resetString = this.generateResetString(user);
      const urlReset = `${redirectUri}?userId=${userId}&resetString=${resetString.resetString}`;

      await transport.sendMail(
        {
          to: user.email,
          subject: 'RETSET PASSWORD PROTEAM',
          text: 'Plaintext version of the message',
          html: `<p>Visit the following link to reset your password <a target="_blank" href="${urlReset}">Rest password Proteam</a></p>`,
        },
        (error, info) => {
          console.log(error);
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async resetPassword(user: User, newPassword: string) {
    try {
      const newPasswordEncoder = bcrypt.hashSync(
        newPassword,
        bcrypt.genSaltSync(10),
      );

      await this.userRepository.update(user.account_id, {
        password: newPasswordEncoder,
      });

      const savedUser = await this.userRepository.findOne({
        where: { account_id: user.account_id },
      });
      delete savedUser.password;
      return savedUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
