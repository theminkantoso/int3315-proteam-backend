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
import { FriendRequestDto } from '../dtos';
import { FriendFollowService } from '../services/friend_follow.service';
import { AcceptFriendDto } from '../dtos/friend_follow/accept_friend.dto';


@ApiTags('Friends')
@Controller('')
@ApiBearerAuth()
// @ApiBasicAuth()
export class FriendController {
  constructor(private readonly userService: UserService,
    private readonly friendFollowService: FriendFollowService) {}

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
  @ApiOperation({ summary: 'Get friend list' })
  @ApiResponse({ status: 200, description: 'Current friend request list' })
  async GetRequests(): Promise<any> {
    // const decoded =  this.userService.decodeJwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw');
    //   console.log(decoded.sub);
    var user = await this.userService.getFriendRequestList(parseInt('1'));
    return user;
    // return user2;
  }

  @ApiOperation({ summary: 'Send friend request (jwt required)' })
  @ApiResponse({ status: 200, description: 'Current Friend Follow info' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  @ApiBadRequestResponse({ status: 400, description: '' })
  // @UseGuards(JwtAuthGuard)
  @Post('friend-request')
  async friendRequest( @Body() friendRequestDto: FriendRequestDto) {
    let id = 1;
    return instanceToPlain(this.friendFollowService.saveFriendFollow(id, friendRequestDto));
  }

  @ApiOperation({ summary: 'Accept friend request (jwt required)'})
  @ApiResponse({ status: 200, description: 'Current Friend Follow info' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  @ApiBadRequestResponse({ status: 400, description: '' })
  // @UseGuards(JwtAuthGuard)
  @Patch('accept-friend')
  async acceptFriend( @Body() acceptFriend: AcceptFriendDto) {
    let id = 3;
    return instanceToPlain(this.friendFollowService.updateFriendFollow(id, acceptFriend));
  }
}