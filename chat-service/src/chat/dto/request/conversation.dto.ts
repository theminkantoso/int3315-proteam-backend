import * as Joi from 'joi';
import { TEXTAREA_MAX_LENGTH } from 'src/common/constants';

export const ConversationSchema = Joi.object({
  is_inbox: Joi.boolean().required().label('is inbox'),
  is_conversation_request: Joi.boolean()
    .required()
    .label('is conversation request'),
  title: Joi.string().max(TEXTAREA_MAX_LENGTH).allow(null).label('title'),
  description: Joi.string()
    .max(TEXTAREA_MAX_LENGTH)
    .allow(null)
    .label('description'),
  background: Joi.string()
    .max(TEXTAREA_MAX_LENGTH)
    .uri()
    .allow(null)
    .label('background'),
});
export class ConversationDto {
  readonly is_inbox: boolean;
  readonly is_conversation_request: boolean;
  readonly title: string | null;
  readonly description: string | null;
  readonly background: string | null;
}
