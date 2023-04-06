import { Skill } from './../entities/skill.entity';
import { UpdateSkillsDto } from './../dtos/update_skills.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateMeDto } from '../dtos/update-me.dto';
// import { UpdatePasswordDto } from '../dtos';
// import * as bcrypt from 'bcrypt';
import { FriendFollow } from '../entities/friend_follow.entity';
import { SkillAccountDto } from '../dtos/skill_account.dto';
import * as bcrypt from 'bcrypt';
import { SkillAccount } from '../entities/skill_account.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(FriendFollow)
    private friendRepository: Repository<FriendFollow>,
    @InjectRepository(SkillAccount)
    private skillAccountRepository: Repository<SkillAccount>,
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
  ) {}

  decodeJwt(token_in: string) {
    const decodedJwt = this.jwtService.decode(token_in);
    return decodedJwt;
  }

  async getOneById(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { account_id: id },
      });
    } catch (err) {
      console.log('Get one user by id error: ', err.message ?? err);
      throw new HttpException(
        `User with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(id: number, user: UpdateMeDto): Promise<User> {
    let foundUser = await this.userRepository.findOneOrFail({
      where: { account_id: id },
    });
    if (!foundUser) {
      throw new HttpException(
        `User with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    var updated = { ...foundUser, ...user };

    return await this.userRepository.save(updated);
  }

  // async update_pass(id: number, user: UpdatePasswordDto): Promise<User> {
  //   let foundUser = await this.userRepository.findOneOrFail({
  //     where: { account_id: id },

  //   });
  //   if (!foundUser) {
  //     throw new HttpException(
  //       `User with id ${id} not found.`,
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  //   const current_password = foundUser.password;
  //   // const abc = await bcrypt.hash(current_password, 10);
  //   // console.log(abc);
  //   // console.log(await bcrypt.compare(user.old_password, current_password));
  //   let correct = await bcrypt.compare(user.old_password, current_password);
  //   if (!correct) {
  //     throw new HttpException(
  //       `Wrong old password`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   // const new_password = user.new_password;
  //   foundUser.password =  bcrypt.hashSync(user.new_password, bcrypt.genSaltSync(10));

  //   // var updated = { ...foundUser, ...new_password};

  // return await this.userRepository.save(foundUser);
  // }

  async getFriend(userid: number, otherid: number): Promise<any> {
    let result = await this.friendRepository
      .createQueryBuilder('friend_follow')
      // .where('friend_follow.status = 1 AND friend_follow.account_id = :userid AND friend_follow.friend_id = :otherid', {userid: userid,  otherid: otherid})
      // .orWhere('friend_follow.status = 1 AND friend_follow.account_id = :otherid AND friend_follow.friend_id = :userid', {userid: userid,  otherid: otherid})
      .where('friend_follow.account_id = :userid AND friend_follow.friend_id = :otherid', {userid: userid,  otherid: otherid})
      .orWhere('friend_follow.account_id = :otherid AND friend_follow.friend_id = :userid', {userid: userid,  otherid: otherid})
      .getOne();
    return result;
  }

  async getFriendList(userid: number): Promise<any> {
    const result1 = await this.userRepository
    .createQueryBuilder('account')
    .innerJoin(
      FriendFollow,
      'friend_follow',
      'account.account_id = friend_follow.friend_id',
    )
    .where('friend_follow.status = 1')
    .andWhere('friend_follow.account_id = :userid', { userid: userid })
    .getMany();

    const result2 = await this.userRepository
    .createQueryBuilder('account')
    .innerJoin(
      FriendFollow,
      'friend_follow',
      'account.account_id = friend_follow.account_id',
    )
    .where('friend_follow.status = 1')
    .andWhere('friend_follow.friend_id = :userid', { userid: userid })
    .getMany();

    return result1.concat(result2);

    // return await this.userRepository
    //   .createQueryBuilder('account')
    //   .innerJoin(
    //     FriendFollow,
    //     'friend_follow',
    //     'account.account_id = friend_follow.friend_id',
    //   )
    //   .where('friend_follow.status = 1')
    //   .andWhere('friend_follow.account_id = :userid', { userid: userid })
    //   .getMany();
  }

  async getFriendRequestList(userid: number): Promise<any> {
    return await this.userRepository
      .createQueryBuilder('account')
      .select([
        'account.account_id',
        'account.name',
        'account.school',
        'account.major',
        'account.avatar',
      ])
      .innerJoin(
        FriendFollow,
        'friend_follow',
        'account.account_id = friend_follow.account_id',
      )
      .where('friend_follow.status = 2')
      .andWhere('friend_follow.friend_id = :userid', { userid: userid })
      .getMany();
  }

  async updateSkills(id: number, skills: UpdateSkillsDto): Promise<String> {
    try {
      if(skills.skills !== null && skills.skills !== undefined && skills.skills.length <= 0 ) {
        throw new HttpException(
          `Array skills is empty.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      var user = await this.userRepository.findOne({
        where: { account_id: id },
      });
      if (!user) {
        throw new HttpException(
          `User with id ${id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        await this.skillAccountRepository.delete({ account_id: id });

        let count = await this.skillRepository
          .createQueryBuilder('skill')
          .where('skill_id IN (:list)', { list: skills.skills })
          .getCount();

        if (count >= 0 && count === skills.skills.length) {
          for (let i = 0; i < count; i++) {
            let skillAcc: SkillAccountDto = {
              skill_id: skills.skills[i],
              account_id: id,
            };
            await this.skillAccountRepository.insert(skillAcc);
          }
          return 'Update user skills successfully.';
        } else {
          throw new HttpException(
            `Has skill with id not found.`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    } catch (err) {
      console.log('error: ', err.message ?? err);
      throw new HttpException(err.message, err.HttpStatus);
    }
  }

  async getSkills(id: number): Promise<Skill[]> {
    try {
      var user = await this.userRepository.findOne({
        where: { account_id: id },
      });
      if (!user) {
        throw new HttpException(
          `User with id ${id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        let skills = await this.skillRepository
          .createQueryBuilder('skill')
          .where(
            'skill_id in (select skill_id from skill_account where account_id=:account_id)',
            { account_id: id },
          )
          .getMany();
        if (!skills) {
          return [];
        } else {
          return skills;
        }
      }
    } catch (err) {
      console.log('error: ', err.message ?? err);
      throw new HttpException(err.message, err.HttpStatus);
    }
  }
}
