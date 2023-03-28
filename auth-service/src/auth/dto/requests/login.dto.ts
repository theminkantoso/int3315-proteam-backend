import * as Joi from 'joi';
import { INPUT_TEXT_MAX_LENGTH } from 'src/common/constants';


import { ApiProperty, PartialType } from '@nestjs/swagger';
  

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
    @ApiProperty({default: "19020001@vnu.edu.vn"})
    readonly email: string;
    
    @ApiProperty({default: "123456"})
    readonly password: string;
}
