import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { Skill } from '../entities/skill.entity';
import { SkillAccount } from '../entities/skill_account.entity'
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SkillService {
    constructor(private readonly jwtService: JwtService,
        @InjectRepository(Skill) private skillRepository: Repository<Skill>,
        @InjectRepository(SkillAccount) private skillAccountRepository: Repository<SkillAccount>,
        @InjectRepository(User) private userRepository: Repository<User>) {}

    decodeJwt(token_in: string) {
        const decodedJwt = this.jwtService.decode(token_in);
        return decodedJwt;
    }

    async skills(): Promise<Skill[]>  {
        try {
            let skills = await this.skillRepository.find();
            if(skills.length > 0) {
                return skills;
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