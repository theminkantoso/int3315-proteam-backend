import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../users/controllers/user.controller';
import { UpdatePasswordController } from './controllers/update_password.controller';
import { FriendFollowController } from './controllers/friend_follow.controller';
import { SkillController } from './controllers/skill.controller';
import { UserService } from '../users/services/user.service';
import { SkillService } from './services/skill.service';
import { FriendFollowService } from './services/friend_follow.service';
import { SkillAccount } from './entities/skill_account.entity';
import { Skill } from './entities/skill.entity';
import { User } from '../users/entities/user.entity';
import { FriendFollow } from './entities/friend_follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, FriendFollow, Skill, SkillAccount])],
  controllers: [UserController, UpdatePasswordController, FriendFollowController, SkillController],
  providers: [UserService, JwtService, FriendFollowService, SkillService],
  exports: [UserModule]
})
export class UserModule {}
