import bcrypt from 'bcrypt';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'account' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Exclude()
    account_id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ type: 'double' })
    gpa: number;

    @Column()
    school: string;

    @Column()
    major: string;

    @Column()
    avatar: string;

    @Column()
    linkedln_link: string;

    @Column()
    phone: string;

    @Exclude()
    @Column()
    role: number;

    @Column()
    cv: string;

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
