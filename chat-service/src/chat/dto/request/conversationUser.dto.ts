import * as Joi from 'joi';

export const ConversationUserSchema = Joi.object({
  user_id: Joi.number().required().label('user id'),
  conversation_id: Joi.number().required().label('conversation id'),
  last_message_id: Joi.number().required().allow(null).label('last message id'),
  is_admin: Joi.boolean().required().label('is admin'),
  mute: Joi.boolean().required().label('mute'),
  seen_last_message: Joi.boolean().required().label('seen last message'),
});
export class ConversationUserDto {
  readonly user_id: number;
  readonly conversation_id: number;
  readonly last_message_id: number | null;
  readonly is_admin: boolean;
  readonly mute: boolean;
  readonly seen_last_message: boolean;
}

export const UpdateConversationUserSchema = Joi.object({
  last_message_id: Joi.number().required().allow(null).label('last message id'),
  is_admin: Joi.boolean().required().label('is admin'),
  mute: Joi.boolean().required().label('mute'),
  seen_last_message: Joi.boolean().required().label('seen last message'),
});
export class UpdateConversationUserDto {
  readonly last_message_id: number | null;
  readonly is_admin: boolean;
  readonly mute: boolean;
  readonly seen_last_message: boolean;
}