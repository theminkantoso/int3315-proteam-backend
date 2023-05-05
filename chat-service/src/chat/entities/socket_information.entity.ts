import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ISocketInformation } from '../chat.interfaces';
import { TypeSocketInformation } from '../chat.constants';

@Entity({ name: 'socket_information' })
export class SocketInformation implements ISocketInformation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  user_id: number;

  @Column({ name: 'status', default: false })
  status: boolean;

  @Column({ name: 'type' })
  type: TypeSocketInformation;

  @Column({ name: 'value', length: 255 })
  value: string;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
