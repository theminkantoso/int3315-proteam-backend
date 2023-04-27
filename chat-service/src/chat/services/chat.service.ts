import { User } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { ConversationUser } from '../entities/conversation_user.entity';
import { ConversationDto } from '../dto/request/conversation.dto';
import {
  ConversationUserDto,
  UpdateConversationUserDto,
} from '../dto/request/conversationUser.dto';
import {
  GetMessageQueryDto,
  MessageDto,
  UpdateMessageDto,
} from '../dto/request/mesage.dto';
import { DEFAULT_LIMIT_MESSAGE_QUERY } from '../chat.constants';
import { SocketInformation } from '../entities/socket_information.entity';
import { SocketInformationDto } from '../dto/request/socket-information.dto';

export const conversationAttributes: (keyof Conversation)[] = [
  'id',
  'is_inbox',
  'is_conversation_request',
  'title',
  'background',
  'description',
];

export const conversationUserAttributes: (keyof ConversationUser)[] = [
  'id',
  'user_id',
  'conversation_id',
  'last_message_id',
  'is_admin',
  'mute',
  'seen_last_message',
];

export const messageAttributes: (keyof Message)[] = [
  'id',
  'user_id',
  'conversation_id',
  'content',
  'file',
  'is_remove',
  'is_unsent',
];

export const socketInformationAttributes: (keyof SocketInformation)[] = [
  'id',
  'user_id',
  'type',
  'value',
  'status',
];

@Injectable()
export class ChatService {
  constructor(
    @InjectEntityManager()
    private readonly dbManager: EntityManager,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(SocketInformation)
    private socketInformationRepository: Repository<SocketInformation>,
    @InjectRepository(ConversationUser)
    private conversationUserRepository: Repository<ConversationUser>,

    private readonly configService: ConfigService,
  ) {}

  // for conversation
  public async getListConversations(relations: string[] = []) {
    try {
      return await this.conversationRepository.find({ relations });
    } catch (error) {
      throw error;
    }
  }

  public async getConversationDetail(id: number) {
    try {
      return await this.conversationRepository.findOne({
        select: conversationAttributes,
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  public async createConversation(data: ConversationDto) {
    try {
      const insertedConversation = await this.conversationRepository.insert(
        data,
      );
      const conversationId = insertedConversation.identifiers[0].id;

      return await this.conversationRepository.findOne({
        select: conversationAttributes,
        where: { id: conversationId },
      });
    } catch (error) {
      throw error;
    }
  }

  public async updateConversation(id: number, data: ConversationDto) {
    try {
      await this.conversationRepository.update(id, data);

      return await this.conversationRepository.findOne({
        select: conversationAttributes,
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  public async deleteConversation(id: number) {
    try {
      await this.conversationRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  public async getConversationSocketInformation(
    id: number,
    relations: string[] = [],
  ) {
    try {
      return await this.conversationRepository.findOne({
        where: { id },
        relations,
      });
    } catch (error) {
      throw error;
    }
  }

  // for conversation-uses

  public async getListConversationUsers() {
    try {
      return await this.conversationUserRepository.find({
        select: conversationUserAttributes,
      });
    } catch (error) {}
  }

  public async getConversationUserDetail(id: number) {
    try {
      return await this.conversationUserRepository.findOne({
        select: conversationUserAttributes,
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  public async createConversationUser(data: ConversationUserDto) {
    try {
      const insertedConversationUser =
        await this.conversationUserRepository.insert(data);
      const conversationUserId = insertedConversationUser.identifiers[0].id;

      return await this.conversationUserRepository.findOne({
        select: conversationUserAttributes,
        where: { id: conversationUserId },
      });
    } catch (error) {
      throw error;
    }
  }

  public async updateConversationUser(
    id: number,
    data: UpdateConversationUserDto,
  ) {
    try {
      await this.conversationUserRepository.update(id, data);

      return await this.conversationUserRepository.findOne({
        select: conversationUserAttributes,
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  public async deleteConversationUser(id: number) {
    try {
      await this.conversationUserRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  // for messages
  public async getListMessages(query: GetMessageQueryDto) {
    try {
      const {
        conversation_id,
        page = 1,
        limit = DEFAULT_LIMIT_MESSAGE_QUERY,
      } = query;
      const skip = (page - 1) * limit;

      const [items, totalItems] = await this.messageRepository.findAndCount({
        select: messageAttributes,
        where: { conversation_id },
        order: { id: 'DESC' },
        take: limit,
        skip,
      });

      return { items, totalItems };
    } catch (error) {}
  }

  public async getMessageDetail(id: number) {
    try {
      return await this.messageRepository.findOne({
        select: messageAttributes,
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  public async createMessage(data: MessageDto) {
    try {
      const insertedMessage = await this.messageRepository.insert(data);
      const messageId = insertedMessage.identifiers[0].id;

      return await this.messageRepository.findOne({
        select: messageAttributes,
        where: { id: messageId },
      });
    } catch (error) {
      throw error;
    }
  }

  public async updateMessage(id: number, data: UpdateMessageDto) {
    try {
      await this.messageRepository.update(id, data);

      return await this.messageRepository.findOne({
        select: messageAttributes,
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  // for socket-information
  public async getListSocketConversation() {
    try {
      return await this.socketInformationRepository.find();
    } catch (error) {
      throw error;
    }
  }

  public async getSocketInformationDetail(id: number) {
    try {
      return await this.socketInformationRepository.findOne({
        select: socketInformationAttributes,
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  public async createSocketInformation(data: SocketInformationDto) {
    try {
      const insertedSocketInformation =
        await this.socketInformationRepository.insert(data);
      const conversationId = insertedSocketInformation.identifiers[0].id;

      return await this.socketInformationRepository.findOne({
        select: socketInformationAttributes,
        where: { id: conversationId },
      });
    } catch (error) {
      throw error;
    }
  }

  public async updateSocketInformation(id: number, data: SocketInformationDto) {
    try {
      await this.socketInformationRepository.update(id, data);

      return await this.socketInformationRepository.findOne({
        select: socketInformationAttributes,
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  public async deleteSocketInformation(id: number) {
    try {
      await this.socketInformationRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
