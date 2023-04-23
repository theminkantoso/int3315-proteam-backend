import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notification' })
export class Noti extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account_id: number;

  @Column()
  description: string;

  @Column()
  isRead: number;

  @Column()
  create_time: Date;
}