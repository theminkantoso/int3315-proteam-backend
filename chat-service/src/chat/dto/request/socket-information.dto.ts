import * as Joi from 'joi';
import { TypeSocketInformation } from 'src/chat/chat.constants';

export const SocketInformationSchema = Joi.object({
  user_id: Joi.number().required().label('user id'),
  value: Joi.string().required().label('value'),
  status: Joi.boolean().required().label('status'),
  type: Joi.string()
    .valid(...Object.values(TypeSocketInformation))
    .required()
    .label('type'),
});
export class SocketInformationDto {
  readonly user_id: number;
  readonly status: boolean;
  readonly type: TypeSocketInformation;
  readonly value: string;
}
