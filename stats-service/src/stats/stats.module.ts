
// import { FriendFollowController } from './controllers/friend_follow.controller';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillAccount } from './entities/skill_account.entity';
import { Skill } from './entities/skill.entity';
import { User } from '../stats/entities/user.entity';
// import { UpdatePasswordController } from './controllers/update_password.controller';
import { JwtStrategy } from 'src/common';
import { PassportModule } from '@nestjs/passport';
import { StatsController } from './controllers/stats.controller';
import { StatsService } from './services/stats.service';
import { School } from './entities/school.entity';
import { Major } from './entities/major.entity';
import { GPAStatsController } from './controllers/gpa_stats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Skill, SkillAccount, School, Major]),
    JwtModule.register({}),
    PassportModule],
  controllers: [StatsController, GPAStatsController],
  providers: [StatsService, JwtService, JwtStrategy],
  exports: [StatsModule]
})
export class StatsModule {}
