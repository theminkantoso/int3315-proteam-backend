import * as Joi from 'joi';

export const CreateNotificationSchema = Joi.object({});

export class CreateNotificationDto {
  readonly account_id: number;
  readonly description: string;
  readonly is_read: boolean;
  readonly create_time: Date;
  readonly type: string;
  readonly notification_token_id?: number;
}
