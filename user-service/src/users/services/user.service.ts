import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateMeDto } from '../dtos/update-me.dto';
// import { UpdatePasswordDto } from '../dtos';
import * as bcrypt from 'bcrypt';
import { FriendFollow } from '../entities/friend_follow.entity';


@Injectable()
export class UserService {
  
  constructor(private readonly jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(FriendFollow) private friendRepository: Repository<FriendFollow>) {}

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

    var updated = { ...foundUser, ...user};

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

  async areFriend(userid: number, otherid: number): Promise<boolean> {
    let result = await this.friendRepository.createQueryBuilder('friend_follow')
    .where('friend_follow.status = 1')
    .andWhere('friend_follow.account_id = :userid', {userid: userid})
    .andWhere('friend_follow.friend_id = :otherid', {otherid: otherid})
    .getOne();
    if (!result) {
      return false;
    } 
    else {return true;}
  }

  async getFriendList(userid: number): Promise<any> {
    return await this.userRepository.createQueryBuilder('account').
    innerJoin(FriendFollow, 'friend_follow', 'account.account_id = friend_follow.friend_id').
    where('friend_follow.status = 1').
    andWhere('friend_follow.account_id = :userid', {userid: userid}).
    getMany();
  }

  async getFriendRequestList(userid: number): Promise<any> {
    return await this.userRepository.createQueryBuilder('account').
    select(['account.name', 'account.school', 'account.major', 'account.avatar']).
    innerJoin(FriendFollow, 'friend_follow', 'account.account_id = friend_follow.friend_id').
    where('friend_follow.status = 2').
    andWhere('friend_follow.account_id = :userid', {userid: userid}).
    getMany();
  }
}
