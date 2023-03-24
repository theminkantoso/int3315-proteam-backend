import { BaseEntity } from 'src/common/base-schema/base-schema';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserTokenType } from '../auth.constants';
import { User } from './user.entity';

@Entity({ name: 'user_tokens' })
export class UserToken extends BaseEntity {
    @Column()
    accountId: number;

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
