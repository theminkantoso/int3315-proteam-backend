import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';

export const notificationAttributes: (keyof Notification)[] = [
  'noti_id',
  'account_id',
  'description',
  'is_read',
  'create_time',
  'type',
  'notification_token_id',
];

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      const insertedNotification = await this.notificationRepository.insert(
        createNotificationDto,
      );
      const notificationId = insertedNotification.identifiers[0].id;

      return await this.notificationRepository.findOne({
        select: notificationAttributes,
        where: { noti_id: notificationId },
      });
    } catch (error) {
      throw error;
    }
  }

  async bulkCreate(data: CreateNotificationDto[]) {
    try {
      const insertedNotification = await this.notificationRepository.save(data);
      return insertedNotification;
    } catch (error) {
      throw error;
    }
  }

  async getAllByUserId(id: number) {
    const allNotification = await this.notificationRepository.find({
      where: {
        account_id: id,
      },
      select: notificationAttributes,
    });

    return allNotification;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
