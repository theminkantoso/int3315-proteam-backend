import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { SkillAccount } from "../entities/skill_account.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Skill } from "../entities/skill.entity";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StatsService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(SkillAccount)
    private skillAccountRepository: Repository<SkillAccount>,
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
  ) {}
  
  async getInformation(): Promise<any> {
    try {
      let schools = await this.userRepository
      .createQueryBuilder('account')
      .select('school')
      .distinct(true)
      .getRawMany();

      const schools2 = schools.map(item => item.school);

      let majors = await this.userRepository
      .createQueryBuilder('account')
      .select('major')
      .distinct(true)
      .getRawMany();

      const majors2 = majors.map(item => item.major);

      let skills = await this.skillRepository
      .find()

      let result = {"schools": schools2, "majors": majors2, "skills": skills}
    return result;
    } catch (err) {
      console.log('Error retrieving information ', err.message ?? err);
      throw new HttpException(
        `Unable to retrieve database data`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
    
  }