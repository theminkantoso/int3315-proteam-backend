import { NotiService } from '../services/noti.service';
import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards, ParseIntPipe, Request, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RmqService } from 'src/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotiDto, NotiFirebaseDto, UpdateNotiFirebaseDto } from '../dtos';


@ApiTags('noti')
@Controller('')
@ApiBearerAuth()
export class NotiController {
  constructor(private readonly notiService: NotiService,
    private readonly rmqService: RmqService,) {}

  // @ApiOperation({ summary: 'noti' })
  // @ApiResponse({ status: 200, description: 'List noti' })
  // @UseGuards(AuthGuard('jwt'))
  // @Get()
  // async search(@Req() req: Request) {
  //   const acc_id = typeof(req['user'].id) === 'string' ? parseInt(req['user'].id) : req['user'].id;
  //   // const acc_id = 1;
  //   return ;
  // }

  @Get()
  getHello(): string {
    return this.notiService.getHello();
  }

  @ApiOperation({ summary: 'notification of user' })
  @ApiResponse({ status: 200, description: 'List notification of user' })
  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async posts(@Req() req: Request) {
    const acc_id =
      typeof req['user'].id === 'string'
        ? parseInt(req['user'].id)
        : req['user'].id;
    // const acc_id = 1;
    return this.notiService.notificationsByAccId(acc_id);
  }

  @ApiOperation({ summary: 'read notification' })
  @ApiResponse({ status: 200, description: 'notification' })
  @UseGuards(AuthGuard('jwt'))
  @Patch('read/:id')
  async readNoti(
    @Req() req: Request, 
    @Query('id', ParseIntPipe) id?: number) {
    const acc_id =
      typeof req['user'].id === 'string'
        ? parseInt(req['user'].id)
        : req['user'].id;
    // const acc_id = 1;
    return this.notiService.readNoti(acc_id, id);
  }

  @EventPattern('posts_created')
  // @UseGuards(JwtAuthGuard)
  async handlePostCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.notiService.createPosts(data);
    this.rmqService.getMessage(context);
  }

  @EventPattern('friend_request')
  // @UseGuards(JwtAuthGuard)
  async handleFriendRequest(@Payload() data: any, @Ctx() context: RmqContext) {
    this.notiService.friendRequest(data);
    this.rmqService.getMessage(context);
  }

  @EventPattern('accept_friend')
  // @UseGuards(JwtAuthGuard)
  async handleAcceptFriend(@Payload() data: any, @Ctx() context: RmqContext) {
    this.notiService.acceptFriend(data);
    this.rmqService.getMessage(context);
  }

  @Put('push/enable')
  @ApiResponse({ status: 200, description: 'notification' })
  @UseGuards(AuthGuard('jwt'))
  async enablePush(
    @Req() req: Request, 
    @Body() update_dto: NotiFirebaseDto
  ) {
    const acc_id =
      typeof req['user'].id === 'string'
        ? parseInt(req['user'].id)
        : req['user'].id;
    return await this.notiService.acceptPushNotification(acc_id, update_dto)  
  }

  @Put('push/disable')
  @ApiResponse({ status: 200, description: 'notification' })
  @UseGuards(AuthGuard('jwt'))
  async disablePush(
    @Req() req: Request, 
    @Body() update_dto: UpdateNotiFirebaseDto,
  ) {
    const acc_id =
      typeof req['user'].id === 'string'
        ? parseInt(req['user'].id)
        : req['user'].id;
    return await this.notiService.disablePushNotification(acc_id, update_dto)
  }
}
