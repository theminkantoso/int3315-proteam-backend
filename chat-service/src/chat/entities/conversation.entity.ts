import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { ConversationUser } from './conversation_user.entity';
import { Message } from './message.entity';

@Entity({ name: 'conversations' })
export class Conversation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: true })
  is_inbox: boolean;

  @Column({ type: 'boolean', default: true })
  is_conversation_request: boolean;

  @Column()
  last_message_id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  background: string;

  @OneToMany(() => Message, (message) => message.conversation)
  messages?: Message[];

  @OneToMany(
    () => ConversationUser,
    (conversationUser) => conversationUser.conversation,
  )
  conversationUser?: ConversationUser[];

  @ManyToMany(() => User, (user) => user.conversations)
  @JoinTable({
    name: 'conversation_users',
    joinColumn: { name: 'conversation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users: User[];
}
