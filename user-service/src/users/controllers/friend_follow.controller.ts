import { FriendFollowDto } from './../dtos/friend_follow/friend_follow.dto';
import { FriendRequestDto } from './../dtos/friend_follow/friend_request.dto';
import { FriendFollow } from './../entities/friend_follow.entity';
import { FriendFollowService } from './../services/friend_follow.service';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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


@ApiTags('Friend request')
@Controller()
@ApiBearerAuth()
export class FriendFollowController {
  constructor(private readonly friendFollowService: FriendFollowService) {}

  @ApiOperation({ summary: 'Accept friend request (jwt required)' })
  @ApiResponse({ status: 200, description: 'Current Friend Follow info' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  // @UseGuards(JwtAuthGuard)
  @Patch('friend-request')
  async friendRequest( @Body() friendRequestDto: FriendRequestDto) {
    let id = 1;
    let request: FriendFollowDto = { account_id: id, friend_id: friendRequestDto.friend_id, status: 2 };

    return instanceToPlain(this.friendFollowService.saveFriendFollow(id, request));
  }

}