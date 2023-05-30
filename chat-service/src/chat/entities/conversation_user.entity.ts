import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Conversation } from './conversation.entity';
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

  @ManyToOne(() => User, (user) => user.conversationUser)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(
    () => Conversation,
    (conversation) => conversation.conversationUser,
  )
  @JoinColumn({ name: 'conversation_id' })
  conversation?: Conversation;
}
