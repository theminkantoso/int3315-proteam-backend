import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import e from 'express';
import { PostReqDto } from '../dtos/post_req.dto';
import { PostDto } from '../dtos/post.dto';
import { PostResDto } from '../dtos/post_res.dto';
import { SkillPostDto } from '../dtos/skill_post.dto';
import { Skill } from '../entities/skill.entity';
import { SkillPost } from '../entities/skill_post.entity';
import { PostUpdateDto } from '../dtos/post_update.dto';

@Injectable()
export class PostService {
    constructor(private readonly jwtService: JwtService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(SkillPost) private skillPostRepository: Repository<SkillPost>,
        @InjectRepository(Skill) private skillRepository: Repository<Skill>,
        @InjectRepository(Post) private postRepository: Repository<Post>) {}

    decodeJwt(token_in: string) {
        const decodedJwt = this.jwtService.decode(token_in);
        return decodedJwt;
    }

    async allPosts(id: number): Promise<Post[]>  {
      try {
         let user = await this.userRepository.findOneOrFail({
          where: { account_id: id },
        });
        if(!user) {
          throw new HttpException(
              `User with id ${id} not found.`,
              HttpStatus.NOT_FOUND,
            );
        }
          let result = await this.postRepository.createQueryBuilder('post')
                .select("post.*, account.name, account.avatar")
                .from(User, "account")
                .where('post.account_id = account.account_id')
          if(user.role === 0 ) {
            result.andWhere(':gpa between min_gpa and max_gpa', {gpa: user.gpa});
          }
          let post = await result.orderBy('create_time', 'DESC').getRawMany();
          if(post.length > 0) {
              return post;
          } else {
              return [];
          }
      } catch (err) {
          console.log('error: ', err.message ?? err);
          throw new HttpException(
            err.message,
            err.HttpStatus
          );
      }
  }

    async postsByAccId(id: number): Promise<Post[]>  {
        try {
           let user = await this.userRepository.findOneOrFail({
            where: { account_id: id },
          });
          if(!user) {
            throw new HttpException(
                `User with id ${id} not found.`,
                HttpStatus.NOT_FOUND,
              );
          }
            let post = await this.postRepository.createQueryBuilder('post')
            .select("post.*, account.name, account.avatar")
            .from(User, "account")
            .where('post.account_id = account.account_id')
            .andWhere('post.account_id = :id', {id: id})
            .orderBy('create_time', 'DESC')
            .getRawMany();
            if(post.length > 0) {
                return post;
            } else {
                return [];
            }
        } catch (err) {
            console.log('error: ', err.message ?? err);
            throw new HttpException(
              err.message,
              err.HttpStatus
            );
        }
    }

    async getPostById(acc_id: number, post_id: number): Promise<PostResDto>  {
      try {
         let user = await this.userRepository.findOneOrFail({
          where: { account_id: acc_id },
        });
        if(!user) {
          throw new HttpException(
              `User with id ${acc_id} not found.`,
              HttpStatus.NOT_FOUND,
            );
        }
        // let post = await this.postRepository.createQueryBuilder('post')
        // .where('post_id = :post_id AND account_id = :account_id', {post_id: post_id, account_id: acc_id})
        // .getOne();
        let result = await this.postRepository.createQueryBuilder('post')
        .select("post.*, account.name, account.avatar")
        .from(User, "account")
        .where('post.account_id = account.account_id')
        .andWhere('post_id = :post_id', {post_id: post_id});
        if(user.role === 0) {
          result.andWhere('((:gpa between min_gpa and max_gpa) or post.account_id = :acc_id)', {gpa: user.gpa, acc_id: acc_id});
        }
        let post = await result.getRawOne();
        if(!post) {
          throw new HttpException(
              `Post not found.`,
              HttpStatus.NOT_FOUND,
            );
        } else {
          let postRes: PostResDto = {post_id: post.post_id, account_id: post.account_id, content: post.content, image: post.image, file: post.file, create_time: post.create_time, min_gpa: post.min_gpa, max_gpa: post.max_gpa, name: post.name, avatar: post.avatar, skills: []};
          let skills = await this.skillRepository.createQueryBuilder('skill')
            .innerJoin(
              SkillPost,
              'skill_post',
              'skill.skill_id = skill_post.skill_id',
            )
            .where('skill_post.post_id = :postId', {postId: post_id})
          .getMany();
          if(skills.length > 0) {
            postRes.skills = skills;
          }
          return postRes;
        }

      } catch (err) {
          console.log('error: ', err.message ?? err);
          throw new HttpException(
            err.message,
            err.HttpStatus
          );
      }
  }

    async createPost(acc_id: number, postDto: PostReqDto): Promise<String> {
      try {
         let user = await this.userRepository.findOneOrFail({
          where: { account_id: acc_id },
        });
        if(!user) {
          throw new HttpException(
              `User with id ${acc_id} not found.`,
              HttpStatus.NOT_FOUND,
            );
        }
        let count = 0;
        // check skill
        if(postDto.skills != null && postDto.skills.length > 0) {
          count = await this.skillRepository
          .createQueryBuilder()
          .where('skill_id IN (:list)', { list: postDto.skills })
          .getCount();

          if ( count >= 0 && count !== postDto.skills.length) {
            throw new HttpException(
              `Has skill with id not found.`,
              HttpStatus.BAD_REQUEST,
            );
          }
        }
        // save
        let post: PostDto = {account_id: acc_id, content: postDto.content, image: postDto.image, file: postDto.file, create_time: new Date(), min_gpa: postDto.min_gpa, max_gpa: postDto.max_gpa};
        let info = await this.postRepository.insert(post);
          if(info) {
              for (let i = 0; i < count; i++) {
                let skillPost: SkillPostDto = {
                  skill_id: postDto.skills[i],
                  post_id: info.raw.insertId,
                };
                await this.skillPostRepository.insert(skillPost);
              }
              return "Create post successfully.";
          } else {
              return "Create post failed.";
          }
      } catch (err) {
          console.log('error: ', err.message ?? err);
          throw new HttpException(
            err.message,
            err.HttpStatus
          );
      }
  }

    async updatePost(acc_id: number, post_id: number, postDto: PostReqDto): Promise<String> {
        try {
           let user = await this.userRepository.findOneOrFail({
            where: { account_id: acc_id },
          });
          if(!user) {
            throw new HttpException(
                `User with id ${acc_id} not found.`,
                HttpStatus.NOT_FOUND,
              );
          }
          let post = await this.postRepository.createQueryBuilder('post')
          .where('post_id = :post_id AND account_id = :account_id', {post_id: post_id, account_id: acc_id})
          .getOne();
          if(!post) {
            throw new HttpException(
                `Post not found.`,
                HttpStatus.NOT_FOUND,
              );
          } else {
            let count = 0;
            // check skill
            if(postDto.skills != null && postDto.skills.length > 0) {
              count = await this.skillRepository
              .createQueryBuilder()
              .where('skill_id IN (:list)', { list: postDto.skills })
              .getCount();

              if ( count >= 0 && count !== postDto.skills.length) {
                throw new HttpException(
                  `Has skill with id not found.`,
                  HttpStatus.BAD_REQUEST,
                );
              }
            }
            // update
            let postUpdate: PostUpdateDto = {content: postDto.content, image: postDto.image, file: postDto.file, min_gpa: postDto.min_gpa, max_gpa: postDto.max_gpa};
            let updated = { ...post, ...postUpdate };
            let info =  await this.postRepository.save(updated);
            if(info) {
                // update skills
                let skills = await this.skillPostRepository.createQueryBuilder('skill_post')
                .where('post_id=:postId', {postId: post_id}).getMany();
                let arr = new Array<Number>();
                if(skills.length > 0) {
                  for(let skill of skills) {
                    arr.push(skill.skill_id);
                  }
                  if(postDto.skills.sort().toString() !== arr.sort().toString()) {
                    await this.skillPostRepository.delete({ post_id: post_id });
                    for (let skill of postDto.skills) {
                      let skillPost: SkillPostDto = {
                        skill_id: skill,
                        post_id: post_id,
                      };
                      await this.skillPostRepository.insert(skillPost);
                    }
                  }
                } else {
                  for (let skill of postDto.skills) {
                    let skillPost: SkillPostDto = {
                      skill_id: skill,
                      post_id: post_id,
                    };
                    await this.skillPostRepository.insert(skillPost);
                  }
                }

                return "Update post successfully.";
            } else {
              return "Update post failed.";
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

    async delete(acc_id: number, post_id: number): Promise<String>  {
        try {
           let user = await this.userRepository.findOneOrFail({
            where: { account_id: acc_id },
          });
          if(!user) {
            throw new HttpException(
                `User with id ${acc_id} not found.`,
                HttpStatus.NOT_FOUND,
              );
          }
          let post = await this.postRepository.createQueryBuilder('post')
          .where('post_id = :post_id AND account_id = :account_id', {post_id: post_id, account_id: acc_id})
          .getOne();
          if(!post) {
            throw new HttpException(
                `Post not found.`,
                HttpStatus.NOT_FOUND,
              );
          } else {
            var info = await this.postRepository.remove(post);
            if(info) {
                return "Delete post successfully.";
            } else {
                return "Delete post failed.";
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

    async postsByOtherUserId(id: number, user_id: number): Promise<Post[]>  {
      try {
         let me = await this.userRepository.findOneOrFail({
          where: { account_id: id },
        });
        if(!me) {
          throw new HttpException(
              `User with id ${id} not found.`,
              HttpStatus.NOT_FOUND,
            );
        }
        let other = await this.userRepository.findOneOrFail({
          where: { account_id: user_id },
        });
        if(!other) {
          throw new HttpException(
              `User with id ${user_id} not found.`,
              HttpStatus.NOT_FOUND,
            );
        }
          let result = await this.postRepository.createQueryBuilder('post')
          .select("post.*, account.name, account.avatar")
          .from(User, "account")
          .where('post.account_id = account.account_id')
          .andWhere('post.account_id = :id', {id: user_id})
          if(me.role === 0 ) {
            result.andWhere(':gpa between min_gpa and max_gpa', {gpa: me.gpa});
          }
          let post = await result.orderBy('create_time', 'DESC').getRawMany();
          if(post.length > 0) {
              return post;
          } else {
              return [];
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