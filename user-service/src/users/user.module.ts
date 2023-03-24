import { FriendFollowService } from './services/friend_follow.service';
// import { FriendFollowController } from './controllers/friend_follow.controller';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../users/controllers/user.controller';
import { UserService } from '../users/services/user.service';
import { User } from '../users/entities/user.entity';
// import { UpdatePasswordController } from './controllers/update_password.controller';
import { FriendFollow } from './entities/friend_follow.entity';
import { FriendController } from './controllers/friend.controller';
import { JwtStrategy } from 'src/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([User, FriendFollow]), 
    JwtModule.register({}),
    PassportModule],
  controllers: [UserController, FriendController],
  providers: [UserService, JwtService, FriendFollowService, JwtStrategy],
  exports: [UserModule]
})
export class UserModule {}
