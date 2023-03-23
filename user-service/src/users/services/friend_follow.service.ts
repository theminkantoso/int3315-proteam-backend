import { FriendFollowDto } from './../dtos/friend_follow/friend_follow.dto';
import { FriendFollow } from '../entities/friend_follow.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class FriendFollowService {
    constructor(private readonly jwtService: JwtService,
        @InjectRepository(FriendFollow) private friendFollowRepository: Repository<FriendFollow>,
        @InjectRepository(User) private userRepository: Repository<User>) {}

    decodeJwt(token_in: string) {
        const decodedJwt = this.jwtService.decode(token_in);
        return decodedJwt;
    }

    // async getById(id: number, idFriend: number ): Promise<Boolean> {
    //     try {
    //         var user = await this.userRepository.findOne({
    //             where: { account_id: id },
    //           });
    //         var friend = await this.userRepository.findOne({
    //             where: { account_id: idFriend },
    //           });
    
    //         if(!user) {
    //             throw new HttpException(
    //                 `User with id ${id} not found.`,
    //                 HttpStatus.NOT_FOUND,
    //               );
    //         }
    //         if(!friend) {
    //             throw new HttpException(
    //                 `User with id ${idFriend} not found.`,
    //                 HttpStatus.NOT_FOUND,
    //               );
    //         }
    //         return true;
    //     } catch (err) {
    //         console.log('error: ', err.message ?? err);
    //         throw new HttpException(
    //           err.message,
    //           err.HttpStatus
    //         );
    //     }
    // }

    async saveFriendFollow(id: number, friendRequest: FriendFollowDto ): Promise<String> {
        try {
            if(id === friendRequest.friend_id) {
                throw new HttpException(
                    `You are sending request to yourself.`,
                    HttpStatus.BAD_REQUEST,
                  );
            }
            var user = await this.userRepository.findOne({
                where: { account_id: id },
              });
            var friend = await this.userRepository.findOne({
                where: { account_id: friendRequest.friend_id },
              });
    
            if(!user) {
                throw new HttpException(
                    `User with id ${id} not found.`,
                    HttpStatus.NOT_FOUND,
                  );
            } else if(!friend) {
                throw new HttpException(
                    `User with id ${friendRequest.friend_id} not found.`,
                    HttpStatus.NOT_FOUND,
                  );
            } else {
                let result = await this.friendFollowRepository
                .createQueryBuilder("friend_follow")
                .where("account_id = :accountId and friend_id = :friendId", {accountId: id, friendId: friendRequest.friend_id} )
                .getOne();
                if(result) {
                    if(result.status === 2) {
                        throw new HttpException(
                            `This person was you friend.`,
                            HttpStatus.BAD_REQUEST,
                          );
                    } else if(result.status === 3) {
                        throw new HttpException(
                            `You were sent friend request.`,
                            HttpStatus.BAD_REQUEST,
                          );
                    }
                } else {
                    let info = await this.friendFollowRepository.insert(friendRequest)
                    if(info) {
                        return "Friend request sent successfully.";
                    } else {
                        return "Friend request failed.";
                    }
                }
            }
        } catch (err) {
            console.log('error: ', err.message ?? err);
            throw new HttpException(
              err.message,
              err.HttpStatus
            );
        }
    }
}