
// import { FriendFollowController } from './controllers/friend_follow.controller';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../users/controllers/user.controller';
// import { UpdatePasswordController } from './controllers/update_password.controller';
// import { FriendFollowController } from './controllers/friend_follow.controller';
import { SkillController } from './controllers/skill.controller';
import { SearchController } from './controllers/search.controller';
import { UserService } from '../users/services/user.service';
import { SkillService } from './services/skill.service';
import { FriendFollowService } from './services/friend_follow.service';
import { SearchService } from './services/search.service';
import { SkillAccount } from './entities/skill_account.entity';
import { Skill } from './entities/skill.entity';
import { User } from '../users/entities/user.entity';
// import { UpdatePasswordController } from './controllers/update_password.controller';
import { FriendFollow } from './entities/friend_follow.entity';
import { FriendController } from './controllers/friend.controller';
import { JwtStrategy, RmqModule } from 'src/common';
import { PassportModule } from '@nestjs/passport';
import { NOTI_SERVICE } from './constants/services';

@Module({
  imports: [TypeOrmModule.forFeature([User, FriendFollow, Skill, SkillAccount]),
    JwtModule.register({}),
    RmqModule.register({
      name: NOTI_SERVICE,
    }),
    PassportModule],
  controllers: [UserController, FriendController, SkillController, SearchController],
  providers: [UserService, JwtService, FriendFollowService, JwtStrategy, SkillService, SearchService],
  exports: [UserModule]
})
export class UserModule {}
