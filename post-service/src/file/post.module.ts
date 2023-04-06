
// import { FriendFollowController } from './controllers/friend_follow.controller';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/common';
import { PassportModule } from '@nestjs/passport';
import { Post } from './entities/post.entity';
import { Skill } from './entities/skill.entity';
import { SkillPost } from './entities/skill_post.entity';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Skill, SkillPost, User ]),
    JwtModule.register({}),
    PassportModule],
  controllers: [PostController],
  providers: [JwtService, JwtStrategy, PostService],
  exports: [PostModule]
})
export class PostModule {}
