import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
  UsePipes,
  HttpException,
} from '@nestjs/common';
import { HttpStatus } from 'src/common/constants';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { extractToken } from 'src/common/helper/commonFunction';
import { ErrorResponse, SuccessResponse } from 'src/common/helper/response';
import { JoiValidationPipe } from 'src/common/pipe/joi.validation.pipe';
import { TrimBodyPipe } from 'src/common/pipe/trim.body.pipe';
import { DatabaseService } from 'src/common/services/mysql.service';
import { SaveOptions, RemoveOptions } from 'typeorm';
import {
  GoogleLoginLinkDto,
  GoogleLoginLinkSchema,
} from './dto/requests/google-login-link.dto';
import {
  GoogleLoginDto,
  GoogleLoginSchema,
} from './dto/requests/google-login.dto';
import { LoginDto, LoginSchema } from './dto/requests/login.dto';
import { changePasswordSchema } from './dto/requests/update-profile.dto';
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
      // console.log(information, '\n', accessToken, '\n',refreshToken);
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
  // @Permissions([
  //     `${PermissionResources.AUTHENTICATE}_${PermissionActions.LOGIN}`,
  // ])
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
      const googleAccessToken = await this.authService.getAccessTokenFromCode(
        decodedCode,
        redirectUri,
      );
      if (!googleAccessToken) {
        const message = 'login information is incorrect';
        return new ErrorResponse(HttpStatus.UNAUTHORIZED, message, []);
      }
      const userInfoEmail = await this.authService.getUserInfoFromAccessToken(
        googleAccessToken,
      );
      if (!userInfoEmail) {
        const message = 'login information is incorrect';
        return new ErrorResponse(HttpStatus.UNAUTHORIZED, message, []);
      }
      const user = {
        account_id: userInfoEmail.user_id,
        name: '',
        email: userInfoEmail.email,
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
      const {
        user: profile,
        accessToken,
        refreshToken,
      } = await this.authService.login(user as unknown as User);
      return new SuccessResponse({ profile, accessToken, refreshToken });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
