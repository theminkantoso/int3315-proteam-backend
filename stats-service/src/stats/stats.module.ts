
// import { FriendFollowController } from './controllers/friend_follow.controller';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillAccount } from './entities/skill_account.entity';
import { Skill } from './entities/skill.entity';
import { User } from '../stats/entities/user.entity';
// import { UpdatePasswordController } from './controllers/update_password.controller';
import { JwtRoleStrategy } from 'src/common';
import { PassportModule } from '@nestjs/passport';
import { StatsController } from './controllers/stats.controller';
import { StatsService } from './services/stats.service';
import { School } from './entities/school.entity';
import { Major } from './entities/major.entity';
import { GPAStatsController } from './controllers/gpa_stats.controller';
import { SchoolStatsController } from './controllers/school.controller';
import { SkillStatsController } from './controllers/skill.controller';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import type { RedisClientOptions } from 'redis';


@Module({
  imports: [TypeOrmModule.forFeature([User, Skill, SkillAccount, School, Major]),
    JwtModule.register({}),
    PassportModule,
    CacheModule.register<RedisClientOptions>({ 
      store: redisStore, 
      url: process.env.REDIS_URI,
      ttl: 300
    })
  ],
  controllers: [StatsController, GPAStatsController, SchoolStatsController, SkillStatsController],
  providers: [StatsService, 
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    }, JwtService, JwtRoleStrategy],
  exports: [StatsModule]
})
export class StatsModule {}
