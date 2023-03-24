import { FriendFollowService } from './services/friend_follow.service';
import { FriendFollowController } from './controllers/friend_follow.controller';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../users/controllers/user.controller';
import { UserService } from '../users/services/user.service';
import { User } from '../users/entities/user.entity';
import { UpdatePasswordController } from './controllers/update_password.controller';
import { FriendFollow } from './entities/friend_follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, FriendFollow])],
  controllers: [UserController, UpdatePasswordController, FriendFollowController],
  providers: [UserService, JwtService, FriendFollowService],
  exports: [UserModule]
})
export class UserModule {}
