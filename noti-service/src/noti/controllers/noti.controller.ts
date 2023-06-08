import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RmqService } from '../../common';
import { NotiFirebaseDto, UpdateNotiFirebaseDto } from '../dtos';
import { NotiService } from '../services/noti.service';

@ApiTags('noti')
@Controller('')
@ApiBearerAuth()
export class NotiController {
  constructor(
    private readonly notiService: NotiService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  getHello(): string {
    return this.notiService.getHello();
  }

  @ApiOperation({ summary: 'notification of user' })
  @ApiResponse({ status: 200, description: 'List notification of user' })
  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async posts(@Req() req: any) {
    const acc_id =
      typeof req['user'].id === 'string'
        ? parseInt(req['user'].id)
        : req['user'].id;
    return this.notiService.notificationsByAccId(acc_id);
  }

  @ApiOperation({ summary: 'read notification' })
  @ApiResponse({ status: 200, description: 'notification' })
  @UseGuards(AuthGuard('jwt'))
  @Patch('read/:id')
  async readNoti(@Req() req: any, @Query('id', ParseIntPipe) id?: number) {
    const acc_id =
      typeof req['user'].id === 'string'
        ? parseInt(req['user'].id)
        : req['user'].id;
    return this.notiService.readNoti(acc_id, id);
  }

  @EventPattern('posts_created')
  async handlePostCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.notiService.createPosts(data);
    this.rmqService.getMessage(context);
  }

  @EventPattern('friend_request')
  async handleFriendRequest(@Payload() data: any, @Ctx() context: RmqContext) {
    this.notiService.friendRequest(data);
    this.rmqService.getMessage(context);
  }

  @EventPattern('accept_friend')
  async handleAcceptFriend(@Payload() data: any, @Ctx() context: RmqContext) {
    this.notiService.acceptFriend(data);
    this.rmqService.getMessage(context);
  }

  @Put('push/enable')
  @ApiResponse({ status: 200, description: 'notification' })
  @UseGuards(AuthGuard('jwt'))
  async enablePush(@Req() req: any, @Body() update_dto: NotiFirebaseDto) {
    const acc_id =
      typeof req['user'].id === 'string'
        ? parseInt(req['user'].id)
        : req['user'].id;
    return await this.notiService.acceptPushNotification(acc_id, update_dto);
  }

  @Put('push/disable')
  @ApiResponse({ status: 200, description: 'notification' })
  @UseGuards(AuthGuard('jwt'))
  async disablePush(
    @Req() req: any,
    @Body() update_dto: UpdateNotiFirebaseDto,
  ) {
    const acc_id =
      typeof req['user'].id === 'string'
        ? parseInt(req['user'].id)
        : req['user'].id;
    return await this.notiService.disablePushNotification(acc_id, update_dto);
  }
}
