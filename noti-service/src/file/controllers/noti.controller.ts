import { NotiService } from '../services/noti.service';
import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
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


@ApiTags('noti')
@Controller('')
// @ApiBearerAuth()
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

  @EventPattern('posts_created')
  // @UseGuards(JwtAuthGuard)
  async handlePostCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.notiService.createPosts(data);
    this.rmqService.getMessage(context);
  }

}
