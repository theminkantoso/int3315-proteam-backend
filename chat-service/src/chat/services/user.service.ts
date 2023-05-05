import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export const usersAttributes: (keyof User)[] = [
  'email',
  'role',
  'account_id',
  'name',
  'gpa',
  'school',
  'major',
  'linkedln_link',
  'phone',
];

@Injectable()
export class UserService {
  constructor(
    @InjectEntityManager()
    private readonly dbManager: EntityManager,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async getUserByEmail(email: string, attributes = usersAttributes) {
    try {
      const user = await this.userRepository.findOne({
        select: attributes,
        where: { email },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async getUserById(id: number, attributes = usersAttributes) {
    try {
      const user = await this.userRepository.findOne({
        select: attributes,
        where: { account_id: id },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
}
