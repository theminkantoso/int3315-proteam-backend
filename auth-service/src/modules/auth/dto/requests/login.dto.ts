import * as Joi from 'joi';
import { INPUT_TEXT_MAX_LENGTH } from 'src/common/constants';

export const LoginSchema = Joi.object({
    email: Joi.string()
        .email()
        .max(INPUT_TEXT_MAX_LENGTH)
        .required()
        .label('email'),
    password: Joi.string()
        .min(6)
        .max(INPUT_TEXT_MAX_LENGTH)
        .required()
        .label('password'),
});
export class LoginDto {
    readonly email: string;
    readonly password: string;
}
