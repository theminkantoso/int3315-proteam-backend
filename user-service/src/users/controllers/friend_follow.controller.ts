// import { AcceptFriendDto } from './../dtos/friend_follow/accept_friend.dto';
// import { FriendFollowDto } from './../dtos/friend_follow/friend_follow.dto';
// import { FriendRequestDto } from './../dtos/friend_follow/friend_request.dto';
// import { FriendFollowService } from './../services/friend_follow.service';
// import { classToPlain, instanceToPlain } from 'class-transformer';
// import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
// import {
//   ApiBadRequestResponse,
//   ApiBasicAuth,
//   ApiBearerAuth,
//   ApiNotFoundResponse,
//   ApiOperation,
//   ApiResponse,
//   ApiTags,
// } from '@nestjs/swagger';
// import { randomUUID } from 'crypto';
import { UnfriendDto } from './../dtos/friend_follow/unfriend.dto';
import { AcceptFriendDto } from './../dtos/friend_follow/accept_friend.dto';
import { FriendFollowDto } from './../dtos/friend_follow/friend_follow.dto';
import { FriendRequestDto } from './../dtos/friend_follow/friend_request.dto';
import { FriendFollowService } from './../services/friend_follow.service';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { randomUUID } from 'crypto';


// @ApiTags('Friend request')
// @Controller()
// @ApiBearerAuth()
// export class FriendFollowController {
//   constructor(private readonly friendFollowService: FriendFollowService) {}

//   @ApiOperation({ summary: 'Send friend request (jwt required)' })
//   @ApiResponse({ status: 200, description: 'Current Friend Follow info' })
//   @ApiNotFoundResponse({ status: 404, description: 'User not found' })
//   @ApiBadRequestResponse({ status: 400, description: '' })
//   // @UseGuards(JwtAuthGuard)
//   @Post('friend-request')
//   async friendRequest( @Body() friendRequestDto: FriendRequestDto) {
//     let id = 1;
//     return instanceToPlain(this.friendFollowService.saveFriendFollow(id, friendRequestDto));
//   }

//   @ApiOperation({ summary: 'Accept friend request (jwt required)'})
//   @ApiResponse({ status: 200, description: 'Current Friend Follow info' })
//   @ApiNotFoundResponse({ status: 404, description: 'User not found' })
//   @ApiBadRequestResponse({ status: 400, description: '' })
//   // @UseGuards(JwtAuthGuard)
//   @Patch('accept-friend')
//   async acceptFriend( @Body() acceptFriend: AcceptFriendDto) {
//     let id = 3;
//     return instanceToPlain(this.friendFollowService.updateFriendFollow(id, acceptFriend));
//   }

// }
  @ApiOperation({ summary: 'Send friend request (jwt required)' })
  @ApiResponse({ status: 200, description: 'message' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  @ApiBadRequestResponse({ status: 400, description: '' })
  // @UseGuards(JwtAuthGuard)
  @Post('friend-request')
  async friendRequest( @Body() friendRequestDto: FriendRequestDto) {
    let id = 1;
    return instanceToPlain(this.friendFollowService.saveFriendFollow(id, friendRequestDto));
  }

  @ApiOperation({ summary: 'Accept friend request (jwt required)'})
  @ApiResponse({ status: 200, description: 'message' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  @ApiBadRequestResponse({ status: 400, description: '' })
  // @UseGuards(JwtAuthGuard)
  @Patch('accept-friend')
  async acceptFriend( @Body() acceptFriend: AcceptFriendDto) {
    let id = 3;
    return instanceToPlain(this.friendFollowService.updateFriendFollow(id, acceptFriend));
  }

  @ApiOperation({ summary: 'Unfriend request (jwt required)'})
  @ApiResponse({ status: 200, description: 'message' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  @ApiBadRequestResponse({ status: 400, description: '' })
  // @UseGuards(JwtAuthGuard)
  @Delete('unfriend')
  async unfriend( @Body() unfriend: UnfriendDto) {
    let id = 1;
    return instanceToPlain(this.friendFollowService.unfriend(id, unfriend));
  }

  // @ApiOperation({ summary: 'Get list friend request (jwt required)' })
  // @ApiResponse({ status: 200, description: 'List friend request' })
  // @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  // @ApiBadRequestResponse({ status: 400, description: '' })
  // // @UseGuards(JwtAuthGuard)
  // @Get('list-friend-request')
  // async listFriendRequest() {
  //   let id = 1;
  //   return instanceToPlain(this.friendFollowService.saveFriendFollow(id, friendRequestDto));
  // }

}
