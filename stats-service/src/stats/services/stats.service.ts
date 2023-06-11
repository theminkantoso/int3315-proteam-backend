import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { SkillAccount } from "../entities/skill_account.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Skill } from "../entities/skill.entity";
import { JwtService } from '@nestjs/jwt';
import { School } from "../entities/school.entity";
import { Major } from "../entities/major.entity";

@Injectable()
export class StatsService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(SkillAccount)
    private skillAccountRepository: Repository<SkillAccount>,
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
    @InjectRepository(School) private schoolRepository: Repository<School>,
    @InjectRepository(Major) private majorRepository: Repository<Major>,
  ) {}
  
  async getInformation(): Promise<any> {
    try {


      let schools = await this.schoolRepository.find();

      let majors = await this.majorRepository
      .createQueryBuilder('major')
      .innerJoin(School,
        'school',
        'major.school_id = school.id')
      .select(['major.major_name', 'school.id', 'school.school_name'])
      .getRawMany();


      let skills = await this.skillRepository
      .find();

      // let result = {"schools": schools2, "majors": majors2, "skills": skills}

      let result = {"schools": schools, "majors": majors, "skills": skills};
    return result;
    } catch (err) {
      console.log('Error retrieving information ', err.message ?? err);
      throw new HttpException(
        `Unable to retrieve database data`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
      
  async getStatsGPA(school: string, major: string, skill: number): Promise<any> {
    // let query = this.userRepository.createQueryBuilder('account').innerJoin(SkillAccount, 'skill_account', 'skill_account.account_id = account.account_id');

    // query = query.select('COUNT(account.account_id)', 'count');
    // // query = query.addSelect(
    // //   `CASE
    // //       WHEN account.gpa >= 3.6 THEN 'xuat_sac'
    // //       WHEN account.gpa >= 3.2 THEN 'gioi'
    // //       WHEN account.gpa >= 2.5 THEN 'kha'
    // //       WHEN account.gpa >= 2.0 THEN 'trung_binh'
    // //       ELSE 'yeu'
    // //   END`,
    // //   'gpaRange'
    // // )
    // if (school !== '') {
    //   query = query.where("account.school = :school", {school});
    // }

    // if (major !== '') {
    //   query = query.where("account.major = :major", {major});
    // }

    // if (skill !== 0) {
    //   query = query.where("skill_account.skill_id = :skill", {skill});
    // }

    // // query = query.groupBy('gpaRange');

    // query = query.where("account.gpa BETWEEN 3.6 and 4.0");

    // // console.log(query.getSql())
    // return await query.getRawMany();

    let result = {"xuat_sac": await this.queryRangeGPA(school, major, skill, 3.6, 4.0),
    "gioi": await this.queryRangeGPA(school, major, skill, 3.2, 3.59),
    "kha": await this.queryRangeGPA(school, major, skill, 2.5, 3.19),
    "trung binh": await this.queryRangeGPA(school, major, skill, 2.0, 2.49),
    "yeu": await this.queryRangeGPA(school, major, skill, 0.0, 1.99)}
    return result;
  }

  async queryRangeGPA(school: string, major: string, skill: number, minGPA: number, maxGPA: number): Promise<any> {
    var query = this.userRepository.createQueryBuilder('account');

    if (skill != 0) {
      query.innerJoin(SkillAccount, 'skill_account', 'skill_account.account_id = account.account_id');
    }
    query.where("account.role = 0");
    query.andWhere("account.gpa BETWEEN :minGPA and :maxGPA", {minGPA, maxGPA});
    query.select('COUNT(account.account_id)', 'count');
    if (school != '') {
      query.andWhere("account.school = :school", {school});
    }

    if (major != '') {
      query.andWhere("account.major = :major", {major});
    }

    if (skill != 0) {
      query.andWhere("skill_account.skill_id = :skill", {skill});
    }

    return await query.getRawMany();
  }

  async getStatsSchool(school: string): Promise<any> {
    var query = this.userRepository.createQueryBuilder('account');
  
    if (school != '') {
      query.select('account.major');
      query.addSelect('COUNT(account.account_id)', 'count');
      query.where("account.role = 0");
      query.andWhere("account.school = :school", {school});
      query.groupBy('major');
    }
    else {
      query.select('account.school');
      query.where("account.role = 0");
      query.addSelect('COUNT(account.account_id)', 'count');
      query.groupBy('school');
    }

    return await query.getRawMany();
  }

  async getStatsSkill(school: string, major: string, hoc_luc: string): Promise<any> {
    var query = this.userRepository.createQueryBuilder('account');
    query.innerJoin(SkillAccount, 'skill_account', 'skill_account.account_id = account.account_id');
    query.innerJoin(Skill, 'skill', 'skill_account.skill_id = skill.skill_id');
    query.select('skill.skill_name');
    query.addSelect('COUNT(account.account_id)', 'count');
    query.where("account.role = 0");
  
    if (school != '') {
      query.andWhere("account.school = :school", {school});
    }

    if (major != '') {
      query.andWhere("account.major = :major", {major});
    }

    if (hoc_luc != '') {
      if (hoc_luc == 'xuat_sac') {
        query.andWhere("account.gpa BETWEEN 3.6 and 4.0");
      }
      else if (hoc_luc == 'gioi') {
        query.andWhere("account.gpa BETWEEN 3.2 and 3.59");
      }
      else if (hoc_luc == 'kha') {
        query.andWhere("account.gpa BETWEEN 2.5 and 3.19");
      }
      else if (hoc_luc == 'trung_binh') {
        query.andWhere("account.gpa BETWEEN 2.0 and 2.49");
      }
      else if (hoc_luc == 'yeu') {
        query.andWhere("account.gpa BETWEEN 0.0 and 1.99");
      }
      else {}
    }
    query.groupBy('skill.skill_id');
    return await query.getRawMany();
  }
}

