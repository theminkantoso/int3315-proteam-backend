import { UserService } from '../services/user.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../entities/user.entity';

// @ApiBearerAuth()
// @ApiTags('cats')
@Controller('me')
export class UserController {
  constructor(private readonly userService: UserService) {}

//   @ApiOperation({ summary: 'Create cat' })
//   @ApiResponse({ status: 200, description: 'Forbidden.' })
  // @Get()
  // getHello(): string {
  //   const decoded =  this.userService.decodeJwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw');
  //   console.log(decoded.sub);
  //   return 'Hi';
  // }

  @Get()
  async GetMe(): Promise<User> {
    // const decoded =  this.userService.decodeJwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw');
    //   console.log(decoded.sub);
    return this.userService.getOneById(parseInt('1'));
  }
}