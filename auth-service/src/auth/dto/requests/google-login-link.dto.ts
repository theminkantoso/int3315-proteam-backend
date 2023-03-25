import * as Joi from 'joi';
import { TEXTAREA_MAX_LENGTH } from 'src/common/constants';

export const GoogleLoginLinkSchema = Joi.object({
    state: Joi.string().label('google state'),
    redirectUri: Joi.string()
        .max(TEXTAREA_MAX_LENGTH)
        .uri()
        .required()
        .label('google redirect uri'),
});
export class GoogleLoginLinkDto {
    readonly state: string;
    readonly redirectUri: string;
}
