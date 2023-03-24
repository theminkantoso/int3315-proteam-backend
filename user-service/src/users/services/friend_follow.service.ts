import { FriendRequestDto } from './../dtos/friend_follow/friend_request.dto';
import { AcceptFriendDto } from './../dtos/friend_follow/accept_friend.dto';
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

    async saveFriendFollow(id: number, friendRequestDto: FriendRequestDto ): Promise<String> {
        try {
            if(id === friendRequestDto.friend_id) {
                throw new HttpException(
                    `You are sending request to yourself.`,
                    HttpStatus.BAD_REQUEST,
                  );
            }
            var user = await this.userRepository.findOne({
                where: { account_id: id },
              });
            var friend = await this.userRepository.findOne({
                where: { account_id: friendRequestDto.friend_id },
              });
            if(!user) {
                throw new HttpException(
                    `User with id ${id} not found.`,
                    HttpStatus.NOT_FOUND,
                  );
            } else if(!friend) {
                throw new HttpException(
                    `User with id ${friendRequestDto.friend_id} not found.`,
                    HttpStatus.NOT_FOUND,
                  );
            } else {
                let result = await this.friendFollowRepository
                .createQueryBuilder("friend_follow")
                .where("account_id = :accountId and friend_id = :friendId", {accountId: id, friendId: friendRequestDto.friend_id} )
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
                    let friendRequest: FriendFollowDto = { account_id: id, friend_id: friendRequestDto.friend_id, status: 3 };
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

    async updateFriendFollow(id: number, accept: AcceptFriendDto ): Promise<String> {
        try {
            if(accept.status !== 1 && accept.status !== 2) {
                throw new HttpException(
                    `status ${accept.status} is not correct`,
                    HttpStatus.BAD_REQUEST,
                  );
            }
            var user = await this.userRepository.findOne({
                where: { account_id: id },
              });
            if(!user) {
                throw new HttpException(
                    `User with id ${id} not found.`,
                    HttpStatus.NOT_FOUND,
                  );
            } else {
                let result = await this.friendFollowRepository
                .createQueryBuilder("friend_follow")
                .where("id=:id and friend_id = :friendId", {id: accept.id, friendId: id} )
                .getOne();
                if(result) {
                    if(result.status === 2) {
                        throw new HttpException(
                            `This person was you friend.`,
                            HttpStatus.BAD_REQUEST,
                          );
                    } else if(result.status === 3 && accept.status === 2) {
                        // accept
                        var updated = { ...result, ...accept};
                        let info = await this.friendFollowRepository.save(updated)
                        if(info) {
                            return "Friend accept successfully.";
                        } else {
                            return "Friend accept failed.";
                        }
                    } else if(result.status === 3 && accept.status === 1) {
                        // refuse
                        var info = await this.friendFollowRepository.remove(result)
                        if(info) {
                            return "Friend refuse successfully.";
                        } else {
                            return "Friend refuse failed.";
                        }
                    }
                } else {
                    throw new HttpException(
                        `FriendFollow with id ${accept.id} not found.`,
                        HttpStatus.NOT_FOUND,
                      );
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