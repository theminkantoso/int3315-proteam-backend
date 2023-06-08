import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notification' })
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  noti_id: number;

  @Column()
  account_id: number;

  @Column()
  description: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({ type: 'timestamp' })
  create_time: Date;

  @Column()
  type: string;

  @Column()
  notification_token_id: number;
}
