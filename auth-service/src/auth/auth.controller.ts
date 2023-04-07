import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { HttpStatus } from 'src/common/constants';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { extractToken } from 'src/common/helper/commonFunction';
import { ErrorResponse, SuccessResponse } from 'src/common/helper/response';
import { JoiValidationPipe } from 'src/common/pipe/joi.validation.pipe';
import { TrimBodyPipe } from 'src/common/pipe/trim.body.pipe';
import { DatabaseService } from 'src/common/services/mysql.service';
import { ICreateUserBody } from './auth.interfaces';
import {
  GoogleLoginLinkDto,
  GoogleLoginLinkSchema,
} from './dto/requests/google-login-link.dto';
import {
  GoogleLoginDto,
  GoogleLoginSchema,
} from './dto/requests/google-login.dto';
import { LoginDto, LoginSchema } from './dto/requests/login.dto';
import {
  GetLinkToResetPasswordDto,
  ResetPasswordDto,
  changePasswordSchema,
  getLinkToResetPasswordSchema,
  resetPasswordSchema,
} from './dto/requests/update-profile.dto';
import { User } from './entities/user.entity';
import { AuthService, usersAttributes } from './services/auth.service';

@Controller({
  path: '',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Post('login')
  @UsePipes(new JoiValidationPipe(LoginSchema))
  async login(@Body(new TrimBodyPipe()) data: LoginDto) {
    try {
      const user = await this.authService.getUserByEmail(data.email, [
        ...usersAttributes,
        'password',
      ]);
      if (!user) {
        const message = 'login unsuccessful';
        return new ErrorResponse(
          HttpStatus.INVALID_USERNAME_OR_PASSWORD,
          message,
          [],
        );
      }

      if (user.password) {
        const isCorrectPassword = await user.validatePassword(data.password);
        if (!isCorrectPassword) {
          const message = 'login unsuccessful';
          return new ErrorResponse(
            HttpStatus.INVALID_USERNAME_OR_PASSWORD,
            message,
            [],
          );
        }
      }

      // every thing ok, return success data
      const {
        user: information,
        accessToken,
        refreshToken,
      } = await this.authService.login(user);
      return new SuccessResponse({
        information,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      // throw new InternalServerErrorException(error);
      new HttpException('message', 400, { cause: new Error(error) });
    }
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(@Request() req) {
    try {
      const result = await this.authService.logout(req.loginUser);
      return new SuccessResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Patch('change-password')
  @UseGuards(JwtGuard)
  async changePassword(
    @Request() req,
    @Body(new TrimBodyPipe(), new JoiValidationPipe(changePasswordSchema))
    body,
  ) {
    try {
      const user = await this.databaseService.getDataById(
        User,
        req.loginUser.id,
      );

      if (!user) {
        const message = 'user does not exist';

        return new ErrorResponse(HttpStatus.ITEM_NOT_FOUND, message, []);
      }

      if (user.password) {
        const isCorrectPassword = await user.validatePassword(body.oldPassword);
        if (!isCorrectPassword) {
          const message = 'password incorrect';
          return new ErrorResponse(
            HttpStatus.INVALID_USERNAME_OR_PASSWORD,
            message,
            [],
          );
        }
      }

      const result = await this.authService.changePassword(
        body,
        req.loginUser.id,
      );

      return new SuccessResponse(result as unknown as Record<string, unknown>);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('refresh-token')
  @UseGuards(JwtGuard)
  async refreshToken(@Req() req) {
    try {
      const loginUser = req.loginUser;
      const isHashTokenExist = this.authService.checkHashToken(
        extractToken(req.headers.authorization),
      );
      if (!isHashTokenExist) {
        const message = 'refresh token is not correct';
        return new ErrorResponse(HttpStatus.UNAUTHORIZED, message, []);
      }
      const {
        user: profile,
        accessToken,
        refreshToken,
      } = await this.authService.refreshToken(loginUser);

      return new SuccessResponse({ profile, accessToken, refreshToken });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('google-login-link')
  @UsePipes(new JoiValidationPipe(GoogleLoginLinkSchema))
  async getGoogleLoginLink(@Query() query: GoogleLoginLinkDto) {
    try {
      const link = this.authService.getGoogleLink(query);
      return new SuccessResponse({
        link: link,
        redirectUri: query.redirectUri,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('google-login')
  @UsePipes(new JoiValidationPipe(GoogleLoginSchema))
  public async loginWithGoogle(@Body(new TrimBodyPipe()) data: GoogleLoginDto) {
    try {
      const { code = null, redirectUri = null } = data;
      const decodedCode = decodeURIComponent(code);
      const googleIdToken = await this.authService.getIdTokenFromCode(
        decodedCode,
        redirectUri,
      );
      if (!googleIdToken) {
        const message = 'login information is incorrect';
        return new ErrorResponse(HttpStatus.UNAUTHORIZED, message, []);
      }
      const userInfoData = await this.authService.getUserInfoFromIdToken(
        googleIdToken,
      );

      if (!userInfoData) {
        const message = 'login information is incorrect';
        return new ErrorResponse(HttpStatus.UNAUTHORIZED, message, []);
      }

      const userInfo = userInfoData.getPayload();

      let user: User;

      const checkUserExist = await this.authService.getUserByEmail(
        userInfo.email,
        [...usersAttributes, 'password'],
      );

      if (checkUserExist) {
        user = checkUserExist;
      } else {
        const newUser: ICreateUserBody = {
          name: userInfo.name,
          email: userInfo.email,
          password: '',
          gpa: 0,
          school: '',
          major: '',
          avatar: '',
          linkedln_link: '',
          phone: '',
          role: 0,
          cv: '',
        };
        user = await this.authService.saveGoogleUser(newUser);
      }

      const {
        user: information,
        accessToken,
        refreshToken,
      } = await this.authService.login(user);

      return new SuccessResponse({
        information,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('reset-password-link')
  @UsePipes(new JoiValidationPipe(getLinkToResetPasswordSchema))
  async getResetPasswordLink(
    @Body(new TrimBodyPipe()) data: GetLinkToResetPasswordDto,
  ) {
    try {
      const user = await this.authService.getUserByEmail(data.email, [
        ...usersAttributes,
      ]);
      if (!user) {
        const message = 'Email does not exist';
        return new ErrorResponse(HttpStatus.NOT_FOUND, message, []);
      }
      // send email
      await this.authService.sendEmailToResetPassword(user, data.redirectUri);

      return new SuccessResponse({});
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('reset-password')
  @UsePipes(new JoiValidationPipe(resetPasswordSchema))
  async resetPasswordLink(@Body(new TrimBodyPipe()) data: ResetPasswordDto) {
    try {
      const user = await this.authService.getUserById(data.userId, [
        ...usersAttributes,
      ]);
      if (!user) {
        const message = 'Email does not exist';
        return new ErrorResponse(HttpStatus.NOT_FOUND, message, []);
      }

      // check reset string here

      const newUserData = await this.authService.resetPassword(
        user,
        data.newPassword,
      );

      return new SuccessResponse(newUserData);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
