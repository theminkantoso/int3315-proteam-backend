import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'account' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  account_id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
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

  @Column()
  role: number;

  @Column()
  cv: string;
}