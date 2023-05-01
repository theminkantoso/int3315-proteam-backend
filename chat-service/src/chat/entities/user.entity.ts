import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import bcrypt from 'bcrypt';
import { ConversationUser } from './conversation_user.entity';
import { Message } from './message.entity';
import { SocketInformation } from './socket_information.entity';
import { Conversation } from './conversation.entity';

@Entity({ name: 'account' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  account_id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'double' })
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
  @Exclude()
  role: number;

  @Column()
  cv: string;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @OneToMany(
    () => ConversationUser,
    (conversationUser) => conversationUser.user,
  )
  conversationUser?: ConversationUser[];

  @OneToMany(() => Message, (message) => message.user)
  messages?: Message[];

  @OneToMany(
    () => SocketInformation,
    (socketInformation) => socketInformation.user,
    {
      eager: true,
    },
  )
  socketInformation?: SocketInformation[];

  @ManyToMany(() => Conversation, (conversations) => conversations.users)
  @JoinTable({
    name: 'user_conversation',
    joinColumn: { name: 'user_id', referencedColumnName: 'account_id' },
    inverseJoinColumn: { name: 'conversation_id' },
  })
  conversations?: Conversation[];
}
