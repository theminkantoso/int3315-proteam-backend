import Joi from 'joi';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from 'src/common/constants';

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
