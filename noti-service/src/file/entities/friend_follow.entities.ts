import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'friend_follow' })
export class FriendFollow extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account_id: number;

  @Column()
  friend_id: number;

  @Column()
  status: number;
}