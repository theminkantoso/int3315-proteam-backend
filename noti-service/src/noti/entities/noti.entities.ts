import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notification' })
export class Noti extends BaseEntity {
  @PrimaryGeneratedColumn()
  noti_id: number;

  @Column()
  account_id: number;

  @Column()
  description: string;

  @Column()
  is_read: number;

  @Column()
  create_time: Date;

  @Column()
  type: string;

  @Column()
  notification_token_id: number
}