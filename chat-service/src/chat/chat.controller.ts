import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Patch,
  Post,
  Query,
  Param,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { HttpStatus } from 'src/common/constants';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { extractToken } from 'src/common/helper/commonFunction';
import {
  CommonListResponse,
  ErrorResponse,
  SuccessResponse,
} from 'src/common/helper/response';
import { JoiValidationPipe } from 'src/common/pipe/joi.validation.pipe';
import { TrimBodyPipe } from 'src/common/pipe/trim.body.pipe';
import { DatabaseService } from 'src/common/services/mysql.service';
import { UserService } from './services/user.service';
import { ChatService } from './services/chat.service';
import {
  ConversationDto,
  ConversationSchema,
} from './dto/request/conversation.dto';
import {
  ConversationUserDto,
  ConversationUserSchema,
  UpdateConversationUserDto,
  UpdateConversationUserSchema,
} from './dto/request/conversationUser.dto';
import { RemoveEmptyQueryPipe } from 'src/common/pipe/removeEmptyQuery.pipe';
import {
  GetMessageQueryDto,
  GetMessageQuerySchema,
  MessageDto,
  MessageSchema,
  UpdateMessageDto,
  UpdateMessageSchema,
} from './dto/request/mesage.dto';
import { Message } from './entities/message.entity';
import {
  SocketInformationDto,
  SocketInformationSchema,
} from './dto/request/socket-information.dto';

@Controller({
  path: '',
})
export class ChatController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  // for conversations
  @Get('/conversation')
  @UseGuards(JwtGuard)
  async getListConversations(@Request() req) {
    try {
      const result = await this.chatService.getListConversations(['users']);
      return new SuccessResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/conversation/get-by-user-id/:id')
  @UseGuards(JwtGuard)
  async getListConversationsByUserId(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      if (id !== req.loginUser.account_id) {
        const message = 'permission denied';
        return new ErrorResponse(HttpStatus.FORBIDDEN, message, []);
      }

      const user = await this.userService.getUserById(id);
      if (!user) {
        const message = 'user not found';
        return new ErrorResponse(HttpStatus.NOT_FOUND, message, []);
      }

      const result = await this.chatService.getAllConversationByUserId(id);
      return new SuccessResponse({ items: result, totalItems: result.length });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/conversation/:id')
  @UseGuards(JwtGuard)
  async getConversationDetail(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const result = await this.chatService.getConversationDetail(id);

      if (!result) {
        const message = 'conversation not found';
        return new ErrorResponse(HttpStatus.ITEM_NOT_FOUND, message, []);
      }

      return new SuccessResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('/conversation')
  @UseGuards(JwtGuard)
  async createConversation(
    @Body(new TrimBodyPipe(), new JoiValidationPipe(ConversationSchema))
    data: ConversationDto,
  ) {
    try {
      const result = await this.chatService.createConversation(data);
      return new SuccessResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Patch('/conversation/:id')
  @UseGuards(JwtGuard)
  async updateConversation(
    @Param('id', ParseIntPipe) id: number,
    @Body(new TrimBodyPipe(), new JoiValidationPipe(ConversationSchema))
    data: ConversationDto,
  ) {
    try {
      const conversation = await this.chatService.getConversationDetail(id);
      if (!conversation) {
        const message = 'conversation not found';
        return new ErrorResponse(HttpStatus.ITEM_NOT_FOUND, message, []);
      }

      const result = await this.chatService.updateConversation(id, data);

      return new SuccessResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete('/conversation/:id')
  @UseGuards(JwtGuard)
  async deleteConversation(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.chatService.deleteConversation(id);
      const message = 'delete conversation successfully';
      return new SuccessResponse({ id }, message);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/conversation/socket/:id')
  @UseGuards(JwtGuard)
  async getConversationSocketInformation(
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const conversation =
        await this.chatService.getConversationSocketInformation(id, ['users']);

      if (!conversation) {
        const message = 'conversation not found';
        return new ErrorResponse(HttpStatus.ITEM_NOT_FOUND, message, []);
      }

      const userIds: number[] = [];
      conversation.users?.forEach((user) => {
        userIds.push(user.account_id);
      });

      return new SuccessResponse({ userIds });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // for conversation users
  @Get('/conversation-user')
  @UseGuards(JwtGuard)
  async getListConversationUsers(@Request() req) {
    try {
      const result = await this.chatService.getListConversationUsers();
      return new SuccessResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/conversation-user/:id')
  @UseGuards(JwtGuard)
  async getUserConversationUserDetail(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.chatService.getConversationUserDetail(id);

      if (!result) {
        const message = 'conversation-user not found';
        return new ErrorResponse(HttpStatus.ITEM_NOT_FOUND, message, []);
      }

      return new SuccessResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('/conversation-user')
  @UseGuards(JwtGuard)
  async createConversationUser(
    @Body(new TrimBodyPipe(), new JoiValidationPipe(ConversationUserSchema))
    data: ConversationUserDto,
  ) {
    try {
      const result = await this.chatService.createConversationUser(data);
      return new SuccessResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Patch('/conversation-user/:id')
  @UseGuards(JwtGuard)
  async updateConversationUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(
      new TrimBodyPipe(),
      new JoiValidationPipe(UpdateConversationUserSchema),
    )
    data: UpdateConversationUserDto,
  ) {
    try {
      const conversationUser = await this.chatService.getConversationUserDetail(
        id,
      );
      if (!conversationUser) {
        const message = 'conversation user not found';
        return new ErrorResponse(HttpStatus.ITEM_NOT_FOUND, message, []);
      }

      const result = await this.chatService.updateConversationUser(id, data);

      return new SuccessResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete('/conversation-user/:id')
  @UseGuards(JwtGuard)
  async deleteConversationUser(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.chatService.deleteConversationUser(id);
      const message = 'delete conversation user successfully';
      return new SuccessResponse({ id }, message);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // for messages
  @Get('/message')
  @UseGuards(JwtGuard)
  async getListMessages(
    @Request() req,
    @Query(
      new RemoveEmptyQueryPipe(),
      new JoiValidationPipe(GetMessageQuerySchema),
    )
    query: GetMessageQueryDto,
  ) {
    try {
      const conversation = await this.chatService.getConversationDetail(
        query.conversation_id,
      );
      if (!conversation) {
        const message = 'conversation not found';
        return new ErrorResponse(HttpStatus.ITEM_NOT_FOUND, message, []);
      }

      const messageList: CommonListResponse<Message> =
        await this.chatService.getListMessages(query);
      return new SuccessResponse(messageList);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/message/:id')
  @UseGuards(JwtGuard)
  async getMessageDetail(@Param('id', ParseIntPipe) id: number) {
    try {
      const message = await this.chatService.getMessageDetail(id);
      if (!message) {
        const messageError = 'message not found';
        return new ErrorResponse(HttpStatus.ITEM_NOT_FOUND, messageError, []);
      }
      return message;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('/message')
  @UseGuards(JwtGuard)
  async createMessage(
    @Request() req,
    @Body(new TrimBodyPipe(), new JoiValidationPipe(MessageSchema))
    data: MessageDto,
  ) {
    try {
      const { user_id, conversation_id } = data;
      if (user_id !== req.loginUser.account_id) {
        const message = 'permission denied';
        return new ErrorResponse(HttpStatus.FORBIDDEN, message, []);
      }
      const conversation = await this.chatService.getConversationDetail(
        conversation_id,
      );
      if (!conversation) {
        const message = 'conversation not found';
        return new ErrorResponse(HttpStatus.ITEM_NOT_FOUND, message, []);
      }
      const message = await this.chatService.createMessage(data);

      return new SuccessResponse(message);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Patch('/message/:id')
  @UseGuards(JwtGuard)
  async updateMessage(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body(new TrimBodyPipe(), new JoiValidationPipe(UpdateMessageSchema))
    data: UpdateMessageDto,
  ) {
    try {
      const messageCurrent = await this.chatService.getMessageDetail(id);

      if (!messageCurrent) {
        const message = 'message not found';
        return new ErrorResponse(HttpStatus.ITEM_NOT_FOUND, message, []);
      }

      if (messageCurrent.user_id !== req.loginUser.account_id) {
        const message = 'permission denied';
        return new ErrorResponse(HttpStatus.FORBIDDEN, message, []);
      }

      const newMessage = await this.chatService.updateMessage(id, data);
      return new SuccessResponse(newMessage);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // for socket information
  @Get('/socket-information')
  @UseGuards(JwtGuard)
  async getListSocketInformation(@Request() req) {
    try {
      const result = await this.chatService.getListConversations(['users']);
      return new SuccessResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/socket-information/:id')
  @UseGuards(JwtGuard)
  async getSocketInformationDetail(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const result = await this.chatService.getSocketInformationDetail(id);

      if (!result) {
        const message = 'socket information not found';
        return new ErrorResponse(HttpStatus.ITEM_NOT_FOUND, message, []);
      }

      return new SuccessResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('/socket-information')
  @UseGuards(JwtGuard)
  async createSocketInformation(
    @Body(new TrimBodyPipe(), new JoiValidationPipe(SocketInformationSchema))
    data: SocketInformationDto,
  ) {
    try {
      const result = await this.chatService.createSocketInformation(data);
      return new SuccessResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Patch('/socket-information/:id')
  @UseGuards(JwtGuard)
  async updateSocketInformation(
    @Param('id', ParseIntPipe) id: number,
    @Body(new TrimBodyPipe(), new JoiValidationPipe(SocketInformationSchema))
    data: SocketInformationDto,
  ) {
    try {
      const socketInformation =
        await this.chatService.getSocketInformationDetail(id);
      if (!socketInformation) {
        const message = 'socket information not found';
        return new ErrorResponse(HttpStatus.ITEM_NOT_FOUND, message, []);
      }

      const result = await this.chatService.updateSocketInformation(id, data);

      return new SuccessResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete('/socket-information/:id')
  @UseGuards(JwtGuard)
  async deleteSocketInformation(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.chatService.deleteSocketInformation(id);
      const message = 'delete socket information successfully';
      return new SuccessResponse({ id }, message);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
