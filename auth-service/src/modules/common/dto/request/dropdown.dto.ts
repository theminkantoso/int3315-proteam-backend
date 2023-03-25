import Joi from 'joi';
import {
    MAX_PAGE,
    MAX_PAGE_SIZE,
    MIN_PAGE,
    MIN_PAGE_SIZE,
    UserStatus,
} from 'src/common/constants';

export class QueryDropdown {
    page?: number;
    limit?: number;
    status?: UserStatus[];
}

export const queryDropdownSchema = Joi.object().keys({
    page: Joi.number().allow(null).min(MIN_PAGE).max(MAX_PAGE).optional(),
    limit: Joi.number()
        .allow(null)
        .min(MIN_PAGE_SIZE)
        .max(MAX_PAGE_SIZE)
        .optional(),
    status: Joi.array()
        .items(Joi.string().valid(...Object.values(UserStatus)))
        .optional()
        .allow(null, ''),
});
