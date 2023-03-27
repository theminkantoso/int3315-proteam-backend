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
  id: number;

  @Column()
  accountId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'accountId' })
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
