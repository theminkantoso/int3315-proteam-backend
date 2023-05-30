import * as Joi from 'joi';

export const MessageSchema = Joi.object({
  user_id: Joi.number().required().label('user id'),
  conversation_id: Joi.number().required().label('conversation id'),
  file: Joi.string().required().allow(null).label('file'),
  content: Joi.string().required().label('content'),
  is_remove: Joi.boolean().required().label('is remove'),
  is_unsent: Joi.boolean().required().label('is unsent'),
});
export class MessageDto {
  readonly user_id: number;
  readonly conversation_id: number;
  readonly content: string;
  readonly file: string | null;
  readonly is_remove: boolean;
  readonly is_unsent: boolean;
}

export const GetMessageQuerySchema = Joi.object({
  conversation_id: Joi.number().required().label('conversation id'),
  page: Joi.number().allow(null).label('page'),
  limit: Joi.number().allow(null).label('limit'),
});
export class GetMessageQueryDto {
  readonly conversation_id: number;
  readonly page: number | null;
  readonly limit: number | null;
}

export const UpdateMessageSchema = Joi.object({
  is_remove: Joi.boolean().required().label('is remove'),
  is_unsent: Joi.boolean().required().label('is unsent'),
});
export class UpdateMessageDto {
  readonly is_remove: boolean;
  readonly is_unsent: boolean;
}
