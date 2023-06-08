import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseIntPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { SuccessResponse } from 'src/common/helper/response';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/get-by-user-id/:id')
  async findAllByUserId(@Request() req, @Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.notificationService.getAllByUserId(id);
      return new SuccessResponse({ items: result, totalItems: result.length });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
