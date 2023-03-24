import { UserService } from '../services/user.service';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { UpdateMeDto } from '../dtos/update-me.dto';


@ApiTags('Friends')
@Controller('')
@ApiBearerAuth()
// @ApiBasicAuth()
export class FriendController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get friend list' })
  @ApiResponse({ status: 200, description: 'Current friend list' })
  // @UseGuards(JwtAuthGuard)
  @Get('friends')
  async GetFriends(): Promise<any> {
    // const decoded =  this.userService.decodeJwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw');
    //   console.log(decoded.sub);
    var user = await this.userService.getFriendList(parseInt('1'));
    return instanceToPlain(user);
    // return user2;
  }

  @Get('requests')
  async GetRequests(): Promise<any> {
    // const decoded =  this.userService.decodeJwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw');
    //   console.log(decoded.sub);
    var user = await this.userService.getFriendRequestList(parseInt('1'));
    return user;
    // return user2;
  }
}