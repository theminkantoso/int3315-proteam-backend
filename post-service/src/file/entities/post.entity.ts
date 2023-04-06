import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'post' })
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column()
  account_id: number;

  @Column()
  content: string;

  @Column()
  image: string;

  @Column()
  file: string;

  @Column()
  create_time: Date;

  @Column()
  min_gpa: number;

  @Column()
  max_gpa: number;
}