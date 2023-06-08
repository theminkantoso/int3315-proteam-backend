import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Conversation } from './conversation.entity';

@Entity({ name: 'messages' })
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  conversation_id: number;

  @Column()
  content: string;

  @Column({ nullable: true })
  file: string;

  @Column({ default: false })
  is_remove: boolean;

  @Column({ default: false })
  is_unsent: boolean;

  @Column({ type: 'timestamp' })
  create_at: Date;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation?: Conversation;
}
