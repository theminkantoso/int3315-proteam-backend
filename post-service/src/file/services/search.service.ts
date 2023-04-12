import { SearchDto } from './../dtos/search.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Post } from '../entities/post.entity';

@Injectable()
export class SearchService {
    constructor(private readonly jwtService: JwtService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Post) private postRepository: Repository<Post>) {}

    decodeJwt(token_in: string) {
        const decodedJwt = this.jwtService.decode(token_in);
        return decodedJwt;
    }

    async searchUser(id: number, search: SearchDto): Promise<Post[]>  {
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
            let posts = await this.postRepository
             .createQueryBuilder('post')
             .andWhere(':gpa between min_gpa and max_gpa', {gpa: user.gpa});
              if(search.content !== null && search.content !== undefined && search.content !== '') {
                posts.andWhere("LOWER(content) LIKE :content", { content:`%${search.content}%` })
             } if(search.skills != null && search.skills != undefined && search.skills.length > 0) {
                posts.andWhere(" EXISTS(select skill_id from skill_post where post.post_id=skill_post.post_id and skill_id IN (:list)) ", {list: search.skills})
             }
             let list = posts.skip(search.page_number).take(search.limit).getMany();
            if(!list) {
                return [];
            }
             return list;
        } catch (err) {
            console.log('error: ', err.message ?? err);
            throw new HttpException(
              err.message,
              err.HttpStatus
            );
        }
    }
}