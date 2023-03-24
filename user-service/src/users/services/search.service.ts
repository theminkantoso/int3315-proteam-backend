import { SearchDto } from './../dtos/search_user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SearchService {
    constructor(private readonly jwtService: JwtService,
        @InjectRepository(User) private userRepository: Repository<User>) {}

    decodeJwt(token_in: string) {
        const decodedJwt = this.jwtService.decode(token_in);
        return decodedJwt;
    }

    async searchUser(search: SearchDto): Promise<User[]>  {
        try {

            let count = await this.userRepository
             .createQueryBuilder("account");
             if(search.name !== null && search.name !== undefined && search.name !== '') {
                count.where("LOWER(name) LIKE '%:name%'", { name: search.name.toLowerCase })
             } if(search.school !== null && search.name !== undefined && search.school !== '' ) {
                count.where("LOWER(school) LIKE '%:school%'", { school: search.school.toLowerCase })
             } if(search.major !== null && search.name !== undefined && search.major !== '' ) {
                count.where("LOWER(major) LIKE '%:major%'", { major: search.major.toLowerCase })
             } if(search.min_gpa !== null && search.min_gpa !== undefined && search.min_gpa > 0
                && search.max_gpa !== null && search.max_gpa !== undefined && search.max_gpa > 0
                && search.max_gpa > search.min_gpa) {
                count.where("gpa BETWEEN :min_gpa and :max_gpa", { min_gpa: search.min_gpa, max_gpa: search.max_gpa})
             } if(search.skills != null && search.skills != undefined && search.skills.length > 0) {
                count.where("skill_id IN (:list)", { list: search.skills })
             }
             let list = count.getRawMany();
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