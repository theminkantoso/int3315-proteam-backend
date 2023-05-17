import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { PostReqDto } from '../dtos/post_req.dto';
import { PostDto } from '../dtos/post.dto';
import { PostResDto } from '../dtos/post_res.dto';
import { SkillPostDto } from '../dtos/skill_post.dto';
import { Skill } from '../entities/skill.entity';
import { SkillPost } from '../entities/skill_post.entity';
import { PostUpdateDto } from '../dtos/post_update.dto';
import { NOTI_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PostService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(SkillPost)
    private skillPostRepository: Repository<SkillPost>,
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @Inject(NOTI_SERVICE) private notiClient: ClientProxy,
  ) {}

  decodeJwt(token_in: string) {
    const decodedJwt = this.jwtService.decode(token_in);
    return decodedJwt;
  }

  async allPosts(id: number): Promise<Post[]> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { account_id: id },
      });
      if (!user) {
        throw new HttpException(
          `User with id ${id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
      const result = await this.postRepository
        .createQueryBuilder('post')
        .select('post.*, account.name, account.avatar, account.role')
        .from(User, 'account')
        .where('post.account_id = account.account_id');
      if (user.role === 0) {
        result.andWhere(':gpa between min_gpa and max_gpa', { gpa: user.gpa });
      }
      const post = await result.orderBy('create_time', 'DESC').getRawMany();
      if (post.length > 0) {
        return post;
      } else {
        return [];
      }
    } catch (err) {
      console.log('error: ', err.message ?? err);
      throw new HttpException(err.message, err.HttpStatus);
    }
  }

  async postsByAccId(id: number): Promise<Post[]> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { account_id: id },
      });
      if (!user) {
        throw new HttpException(
          `User with id ${id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
      const post = await this.postRepository
        .createQueryBuilder('post')
        .select('post.*, account.name, account.avatar, account.role')
        .from(User, 'account')
        .where('post.account_id = account.account_id')
        .andWhere('post.account_id = :id', { id: id })
        .orderBy('create_time', 'DESC')
        .getRawMany();
      if (post.length > 0) {
        return post;
      } else {
        return [];
      }
    } catch (err) {
      console.log('error: ', err.message ?? err);
      throw new HttpException(err.message, err.HttpStatus);
    }
  }

  async getPostById(acc_id: number, post_id: number): Promise<PostResDto> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { account_id: acc_id },
      });
      if (!user) {
        throw new HttpException(
          `User with id ${acc_id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
      // let post = await this.postRepository.createQueryBuilder('post')
      // .where('post_id = :post_id AND account_id = :account_id', {post_id: post_id, account_id: acc_id})
      // .getOne();
      const result = await this.postRepository
        .createQueryBuilder('post')
        .select('post.*, account.name, account.avatar, account.role')
        .from(User, 'account')
        .where('post.account_id = account.account_id')
        .andWhere('post_id = :post_id', { post_id: post_id });
      if (user.role === 0) {
        result.andWhere(
          '((:gpa between min_gpa and max_gpa) or post.account_id = :acc_id)',
          { gpa: user.gpa, acc_id: acc_id },
        );
      }
      const post = await result.getRawOne();
      if (!post) {
        throw new HttpException(`Post not found.`, HttpStatus.NOT_FOUND);
      } else {
        const postRes: PostResDto = {
          post_id: post.post_id,
          account_id: post.account_id,
          content: post.content,
          image: post.image,
          file: post.file,
          create_time: post.create_time,
          min_gpa: post.min_gpa,
          max_gpa: post.max_gpa,
          name: post.name,
          avatar: post.avatar,
          role: post.role,
          skills: [],
        };
        const skills = await this.skillRepository
          .createQueryBuilder('skill')
          .innerJoin(
            SkillPost,
            'skill_post',
            'skill.skill_id = skill_post.skill_id',
          )
          .where('skill_post.post_id = :postId', { postId: post_id })
          .getMany();
        if (skills.length > 0) {
          postRes.skills = skills;
        }
        return postRes;
      }
    } catch (err) {
      console.log('error: ', err.message ?? err);
      throw new HttpException(err.message, err.HttpStatus);
    }
  }

  async createPost(acc_id: number, postDto: PostReqDto): Promise<string> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { account_id: acc_id },
      });
      if (!user) {
        throw new HttpException(
          `User with id ${acc_id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
      let count = 0;
      // check skill
      if (postDto.skills != null && postDto.skills.length > 0) {
        count = await this.skillRepository
          .createQueryBuilder()
          .where('skill_id IN (:list)', { list: postDto.skills })
          .getCount();

        if (count >= 0 && count !== postDto.skills.length) {
          throw new HttpException(
            `Has skill with id not found.`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      // save
      const post: PostDto = {
        account_id: acc_id,
        content: postDto.content,
        image: postDto.image,
        file: postDto.file,
        create_time: new Date(),
        min_gpa: postDto.min_gpa,
        max_gpa: postDto.max_gpa,
      };
      const info = await this.postRepository.insert(post);
      if (info) {
        for (let i = 0; i < count; i++) {
          const skillPost: SkillPostDto = {
            skill_id: postDto.skills[i],
            post_id: info.raw.insertId,
          };
          await this.skillPostRepository.insert(skillPost);
        }
        await lastValueFrom(
          this.notiClient.emit('posts_created', {
            post,
          }),
        );
        return 'Create post successfully.';
      } else {
        return 'Create post failed.';
      }
    } catch (err) {
      console.log('error: ', err.message ?? err);
      throw new HttpException(err.message, err.HttpStatus);
    }
  }

  async updatePost(
    acc_id: number,
    post_id: number,
    postDto: PostReqDto,
  ): Promise<string> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { account_id: acc_id },
      });
      if (!user) {
        throw new HttpException(
          `User with id ${acc_id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
      const post = await this.postRepository
        .createQueryBuilder('post')
        .where('post_id = :post_id AND account_id = :account_id', {
          post_id: post_id,
          account_id: acc_id,
        })
        .getOne();
      if (!post) {
        throw new HttpException(`Post not found.`, HttpStatus.NOT_FOUND);
      } else {
        let count = 0;
        // check skill
        if (postDto.skills != null && postDto.skills.length > 0) {
          count = await this.skillRepository
            .createQueryBuilder()
            .where('skill_id IN (:list)', { list: postDto.skills })
            .getCount();

          if (count >= 0 && count !== postDto.skills.length) {
            throw new HttpException(
              `Has skill with id not found.`,
              HttpStatus.BAD_REQUEST,
            );
          }
        }
        // update
        const postUpdate: PostUpdateDto = {
          content: postDto.content,
          image: postDto.image,
          file: postDto.file,
          min_gpa: postDto.min_gpa,
          max_gpa: postDto.max_gpa,
        };
        const updated = { ...post, ...postUpdate };
        const info = await this.postRepository.save(updated);
        if (info) {
          // update skills
          const skills = await this.skillPostRepository
            .createQueryBuilder('skill_post')
            .where('post_id=:postId', { postId: post_id })
            .getMany();
          const arr = new Array<number>();
          if (skills.length > 0) {
            for (const skill of skills) {
              arr.push(skill.skill_id);
            }
            if (postDto.skills.sort().toString() !== arr.sort().toString()) {
              await this.skillPostRepository.delete({ post_id: post_id });
              for (const skill of postDto.skills) {
                const skillPost: SkillPostDto = {
                  skill_id: skill,
                  post_id: post_id,
                };
                await this.skillPostRepository.insert(skillPost);
              }
            }
          } else {
            for (const skill of postDto.skills) {
              const skillPost: SkillPostDto = {
                skill_id: skill,
                post_id: post_id,
              };
              await this.skillPostRepository.insert(skillPost);
            }
          }

          return 'Update post successfully.';
        } else {
          return 'Update post failed.';
        }
      }
    } catch (err) {
      console.log('error: ', err.message ?? err);
      throw new HttpException(err.message, err.HttpStatus);
    }
  }

  async delete(acc_id: number, post_id: number): Promise<string> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { account_id: acc_id },
      });
      if (!user) {
        throw new HttpException(
          `User with id ${acc_id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
      const post = await this.postRepository
        .createQueryBuilder('post')
        .where('post_id = :post_id AND account_id = :account_id', {
          post_id: post_id,
          account_id: acc_id,
        })
        .getOne();
      if (!post) {
        throw new HttpException(`Post not found.`, HttpStatus.NOT_FOUND);
      } else {
        const info = await this.postRepository.remove(post);
        if (info) {
          return 'Delete post successfully.';
        } else {
          return 'Delete post failed.';
        }
      }
    } catch (err) {
      console.log('error: ', err.message ?? err);
      throw new HttpException(err.message, err.HttpStatus);
    }
  }

  async postsByOtherUserId(id: number, user_id: number): Promise<Post[]> {
    try {
      const me = await this.userRepository.findOneOrFail({
        where: { account_id: id },
      });
      if (!me) {
        throw new HttpException(
          `User with id ${id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
      const other = await this.userRepository.findOneOrFail({
        where: { account_id: user_id },
      });
      if (!other) {
        throw new HttpException(
          `User with id ${user_id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
      const result = await this.postRepository
        .createQueryBuilder('post')
        .select('post.*, account.name, account.avatar, account.role')
        .from(User, 'account')
        .where('post.account_id = account.account_id')
        .andWhere('post.account_id = :id', { id: user_id });
      if (me.role === 0) {
        result.andWhere(':gpa between min_gpa and max_gpa', { gpa: me.gpa });
      }
      const post = await result.orderBy('create_time', 'DESC').getRawMany();
      if (post.length > 0) {
        return post;
      } else {
        return [];
      }
    } catch (err) {
      console.log('error: ', err.message ?? err);
      throw new HttpException(err.message, err.HttpStatus);
    }
  }
}
