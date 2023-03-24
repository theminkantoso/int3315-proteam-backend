import { UserService } from '../services/user.service';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
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
import { AuthGuard } from '@nestjs/passport';
import { UnfriendDto } from '../dtos/friend_follow/unfriend.dto';


@ApiTags('Friends')
@Controller('')
@ApiBearerAuth()
// @ApiBasicAuth()
export class FriendController {
  constructor(private readonly userService: UserService,
    private readonly friendFollowService: FriendFollowService) {}

  @ApiOperation({ summary: 'Get friend list' })
  @ApiResponse({ status: 200, description: 'Current friend list' })
  @UseGuards(AuthGuard('jwt'))
  @Get('friends')
  async GetFriends(@Req() req :Request): Promise<any> {
    const acc_id = typeof(req['user'].id) === 'string' ? parseInt(req['user'].id) : req['user'].id;
    var user = await this.userService.getFriendList(acc_id);
    return instanceToPlain(user);
    // return user2;
  }

  @Get('requests')
  @ApiOperation({ summary: 'Get friend list' })
  @ApiResponse({ status: 200, description: 'Current friend request list' })
  @UseGuards(AuthGuard('jwt'))
  async GetRequests(@Req() req :Request): Promise<any> {
    const acc_id = typeof(req['user'].id) === 'string' ? parseInt(req['user'].id) : req['user'].id;
    var user = await this.userService.getFriendRequestList(acc_id);
    return user;
  }

  @ApiOperation({ summary: 'Send friend request (jwt required)' })
  @ApiResponse({ status: 200, description: 'Current Friend Follow info' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  @ApiBadRequestResponse({ status: 400, description: '' })
  @UseGuards(AuthGuard('jwt'))
  @Post('friend-request')
  async friendRequest(@Req() req :Request,
    @Body() friendRequestDto: FriendRequestDto) {
    const acc_id = typeof(req['user'].id) === 'string' ? parseInt(req['user'].id) : req['user'].id;
    return instanceToPlain(this.friendFollowService.saveFriendFollow(acc_id, friendRequestDto));
  }

  @ApiOperation({ summary: 'Accept friend request (jwt required)'})
  @ApiResponse({ status: 200, description: 'Current Friend Follow info' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  @ApiBadRequestResponse({ status: 400, description: '' })
  @UseGuards(AuthGuard('jwt'))
  @Patch('accept-friend')
  async acceptFriend(@Req() req :Request,
   @Body() acceptFriend: AcceptFriendDto) {
    const acc_id = typeof(req['user'].id) === 'string' ? parseInt(req['user'].id) : req['user'].id;
    return instanceToPlain(this.friendFollowService.updateFriendFollow(acc_id, acceptFriend));
  }

  @ApiOperation({ summary: 'Unfriend request (jwt required)'})
  @ApiResponse({ status: 200, description: 'message' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  @ApiBadRequestResponse({ status: 400, description: '' })
  @UseGuards(AuthGuard('jwt'))
  @Delete('unfriend')
  async unfriend(@Req() req :Request,
   @Body() unfriend: UnfriendDto) {
    const acc_id = typeof(req['user'].id) === 'string' ? parseInt(req['user'].id) : req['user'].id;
    return instanceToPlain(this.friendFollowService.unfriend(acc_id, unfriend));
  }
}