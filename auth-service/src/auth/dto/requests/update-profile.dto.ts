import Joi from 'joi';
import {
  INPUT_TEXT_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  TEXTAREA_MAX_LENGTH,
} from 'src/common/constants';

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .max(PASSWORD_MAX_LENGTH)
    .optional()
    .allow(null, '')
    .label('old password'),
  newPassword: Joi.string()
    .max(PASSWORD_MAX_LENGTH)
    .min(PASSWORD_MIN_LENGTH)
    .required()
    .label('new password'),
});

export class ChangePasswordDto {
  oldPassword!: string;
  newPassword!: string;
}

export const getLinkToResetPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .max(INPUT_TEXT_MAX_LENGTH)
    .required()
    .label('email'),
  redirectUri: Joi.string()
    .max(TEXTAREA_MAX_LENGTH)
    .uri()
    .required()
    .label('reset redirect uri'),
});

export class GetLinkToResetPasswordDto {
  email!: string;
  redirectUri!: string;
}

export const resetPasswordSchema = Joi.object({
  newPassword: Joi.string()
    .max(INPUT_TEXT_MAX_LENGTH)
    .required()
    .label('new password'),
  userId: Joi.number().required().label('user ID'),
  resetString: Joi.string()
    .max(TEXTAREA_MAX_LENGTH)
    .required()
    .label('reset string'),
});

export class ResetPasswordDto {
  newPassword!: string;
  userId!: number;
  resetString!: string;
}
