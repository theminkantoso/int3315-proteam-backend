import { NotiDto } from './../dtos/noti.dto';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Noti } from '../entities/noti.entities';
import { User } from '../entities/user.entities';
import { Constant } from '../constants/message';
import * as firebase from 'firebase-admin';
import { NotiToken } from '../entities/noti_token.entities';
import { NotiFirebaseDto, UpdateNotiFirebaseDto } from '../dtos';

@Injectable()
export class NotiService {
  constructor(
    @InjectRepository(Noti) private notiRepository: Repository<Noti>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(NotiToken)
    private readonly notificationTokenRepo: Repository<NotiToken>,
  ) {}

  private readonly logger = new Logger(NotiService.name);
  getHello(): string {
    return 'Hello World!';
  }

  async notificationsByAccId(user_id: number): Promise<any> {
    var user = await this.userRepository.findOne({
      where: { account_id: user_id },
    });
    if (!user) {
      throw new HttpException(
        `User with id ${user_id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      let list = this.notiRepository
        .createQueryBuilder()
        .where('account_id = :id', { id: user_id })
        .orderBy('create_time', 'DESC')
        .getMany();
      return list;
    }
  }

  async readNoti(user_id: number, id: number): Promise<any> {
    var user = await this.userRepository.findOne({
      where: { account_id: user_id },
    });
    if (!user) {
      throw new HttpException(
        `User with id ${user_id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      var noti = await this.notiRepository
        .createQueryBuilder()
        .where('noti_id = :id AND account_id = :user_id', {
          id: id,
          user_id: user_id,
        })
        .getOne();
      if (!noti) {
        throw new HttpException(
          `Notification with id ${id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        const notiUpdate: NotiDto = {
          account_id: noti.account_id,
          description: noti.description,
          is_read: 1,
          create_time: noti.create_time,
          type: noti.type,
        };
        const updated = { ...noti, ...notiUpdate };
        const info = await this.notiRepository.save(updated);
        if (info) {
          return notiUpdate;
        } else {
          return null;
        }
      }
    }
  }

  async createPosts(data: any) {
    // this.logger.log('Posts...', data);
    const msg = data['post'];
    var user = await this.userRepository.findOne({
      where: { account_id: msg.account_id },
    });
    if (!user) {
      throw new HttpException(
        `User with id ${msg.account_id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      this.logger.log('Posts...', msg);
    }
  }

  async friendRequest(data: any) {
    // this.logger.log('Data...', data);
    const req = data['friendRequest'];
    const user = data['user'];
    const friendFollowId = data['info'].raw.insertId;
    // this.logger.log(friendFollowId);
    // this.logger.log('Friend request...', req);
    // this.logger.log('Account...', user)
    // const noti : NotiDto = {account_id: req.friend_id, description: user.name + Constant.FRIEND_REQUEST, is_read: 0, create_time: new Date(), type: Constant.FRIEND_REQUEST_KEY + req.account_id}
    // this.logger.log(noti.description);
    // await this.notiRepository.insert(noti);
    this.sendPush(
      req.friend_id,
      Constant.FRIEND_REQUEST_KEY,
      user.name + Constant.FRIEND_REQUEST,
      Constant.FRIEND_REQUEST_KEY + ':' + req.account_id,
    );
  }

  async acceptFriend(data: any) {
    // this.logger.log('Data...', data);
    const req = data['result2'];
    const user = data['user'];
    // this.logger.log('Friend request...', req);
    // this.logger.log('Account...', user)
    // const noti : NotiDto = {account_id: req.friend_id, description: user.name + Constant.ACCEPT_FRIEND, is_read: 0, create_time: new Date(), type: Constant.ACCEPT_FRIEND_KEY + req.id}
    // this.logger.log(noti.description);
    // await this.notiRepository.insert(noti);
    this.sendPush(
      req.account_id,
      Constant.ACCEPT_FRIEND_KEY,
      user.name + Constant.ACCEPT_FRIEND,
      Constant.ACCEPT_FRIEND_KEY + ':' + req.id,
    );
  }

  acceptPushNotification = async (
    user_id: number,
    notification_dto: NotiFirebaseDto,
  ): Promise<NotiToken> => {
    try {
      var user = await this.userRepository.findOne({
        where: { account_id: user_id },
      });
      if (user) {
        await this.notificationTokenRepo.update(
          { account_id: user_id },
          {
            status: 'INACTIVE',
          },
        );
        // save to db
        const notification_token = await this.notificationTokenRepo.save({
          account_id: user_id,
          device_type: notification_dto.device_type,
          notification_token: notification_dto.notification_token,
          status: 'ACTIVE',
        });
        return notification_token;
      } else {
        throw new HttpException(
          `User with id ${user_id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      return error;
    }
  };

  disablePushNotification = async (
    user_id: number,
    update_dto: UpdateNotiFirebaseDto,
  ): Promise<void> => {
    try {
      var user = await this.userRepository.findOne({
        where: { account_id: user_id },
      });
      if (user) {
        await this.notificationTokenRepo.update(
          { account_id: user_id, device_type: update_dto.device_type },
          {
            status: 'INACTIVE',
          },
        );
      } else {
        throw new HttpException(
          `User with id ${user_id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      return error;
    }
  };

  getNotifications = async (user_id: number): Promise<any> => {
    var user = await this.userRepository.findOne({
      where: { account_id: user_id },
    });
    if (user) {
      return await this.notiRepository
        .createQueryBuilder()
        .where('account_id = :id ', {
          id: user_id,
        });
    } else {
      throw new HttpException(
        `User with id ${user_id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  };

  sendPush = async (
    user_id: number,
    title: string,
    body: string,
    type: string,
  ): Promise<void> => {
    try {
      const notification = await this.notificationTokenRepo.findOne({
        where: { account_id: user_id, status: 'ACTIVE' },
      });
      if (notification) {
        await this.notiRepository.save({
          account_id: user_id,
          description: body,
          is_read: 0,
          create_time: new Date(),
          type: type,
          notification_token_id: notification.id,
        });

        await firebase
          .messaging()
          .send({
            notification: { title, body },
            token: notification.notification_token,
            android: { priority: 'high' },
          })
          .catch((error: any) => {
            console.error(error);
          });
      } else {
        await this.notiRepository.save({
          account_id: user_id,
          description: body,
          is_read: 0,
          create_time: new Date(),
          type: type,
        });
      }
    } catch (error) {
      return error;
    }
  };
}
