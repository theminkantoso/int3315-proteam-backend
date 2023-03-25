import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { UserTokenType } from '../auth.constants';
import { User } from './user.entity';

@Entity({ name: 'user_tokens' })
export class UserToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  account_id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;

  // hash token value to find faster
  @Column({ length: 2000 })
  hashToken: string;

  @Column({ type: 'blob' })
  token: string;

  @Column({
    type: 'enum',
    enum: UserTokenType,
    default: UserTokenType.REFRESH_TOKEN,
  })
  type: UserTokenType;
}
