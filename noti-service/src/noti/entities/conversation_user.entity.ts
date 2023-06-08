import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'conversation_users' })
export class ConversationUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  conversation_id: number;

  @Column({ default: false })
  is_admin: boolean;

  @Column({ default: false })
  mute: boolean;

  @Column({ default: false })
  seen_last_message: boolean;
}
