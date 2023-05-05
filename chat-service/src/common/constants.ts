import dotenv from 'dotenv';
import Joi from 'joi';
dotenv.config();

export enum OrderDirection {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

export type TYPE_ORM_ORDER_DIRECTION = 'ASC' | 'DESC';

export const AUTHORIZATION_TYPE = 'refresh_token';

export enum OrderBy {
  ID = '_id',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum UserTokenTypes {
  REFRESH_TOKEN = 'refresh_token',
  ACTIVE_USER = 'active_user',
  RESET_PASSWORD = 'reset_password',
}

export const DEFAULT_LIMIT_FOR_DROPDOWN = 1000;
export const DEFAULT_LIMIT_FOR_PAGINATION = 10;
export const DEFAULT_FIRST_PAGE = 1;
export const DEFAULT_ORDER_BY = 'createdAt';
export const DEFAULT_ORDER_DIRECTION = 'desc';

export const TIMEZONE_HEADER = 'x-timezone';
export const TIMEZONE_NAME_HEADER = 'x-timezone-name';

export const INTEGER_POSITIVE_MIN_VALUE = 1;
export const INTEGER_POSITIVE_MAX_VALUE = 4294967295;
export const MAX_PAGE_LIMIT = 1000;

export const INPUT_TEXT_MAX_LENGTH = 255;
export const TEXTAREA_MAX_LENGTH = 2000;
export const ARRAY_MAX_LENGTH = 500;

export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 64;

export const COLOR_CODE_MAX_LENGTH = 7;
export const PHONE_NUMBER_LENGTH = 10;
export const INPUT_NAME_MAX_LENGTH = 40;

export const MIN_PAGE_SIZE = 0;
export const MIN_PAGE = 1;
export const MAX_PAGE_SIZE = 10000;
export const MAX_PAGE = 10000;

export const Regex = {
  URI: /^https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/,
  EMAIL:
    /^(([a-zA-Z0-9 +]+)([.-]{1})?)*[a-zA-Z0-9]@([a-zA-Z0-9 -]+[.])+[a-zA-Z0-9]+$/,
  NUMBER: /^(?:[0-9]\d*|)$/,
  PHONE_NUMBER: /^([0-9 +-]){3,40}$/,
  CODE: /^[a-zA-Z\-_0-9]+$/,
  PASSWORD: /^.*([a-zA-Z].*[0-9]|[0-9].*[a-zA-Z]).*$/,
  COLOR: /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
};

export enum DateFormat {
  YYYY_MM_DD_HYPHEN = 'YYYY-MM-DD',
  HH_mm_ss_COLON = 'HH:mm:ss',
  YYYY_MM_DD_HYPHEN_HH_mm_ss_COLON = 'YYYY-MM-DD HH:mm:ss',
}

export const CommonListQuerySchema = {
  page: Joi.number().positive().optional().allow(null),
  limit: Joi.number().positive().max(MAX_PAGE_LIMIT).optional().allow(null),
  keyword: Joi.string().max(INPUT_TEXT_MAX_LENGTH).optional().allow(null, ''),
  orderDirection: Joi.string()
    .valid(...Object.values(OrderDirection))
    .optional(),
  orderBy: Joi.string()
    .valid(...Object.values(OrderBy))
    .optional(),
};

export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INVALID_USERNAME_OR_PASSWORD = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  GROUP_HAS_CHILDREN = 410,
  GROUP_MAX_QUANTITY = 412,
  EXCEED_LIMIT = 413,
  FAILED_DEPENDENCY = 424,
  ITEM_NOT_FOUND = 444,
  ITEM_ALREADY_EXIST = 445,
  ITEM_INVALID = 446,
  ITEM_IS_USING = 447,
  USER_HAVE_NOT_PERMISSION = 448,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export const SocketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  WEB_APP_USER_LOGIN: 'web_app_user_login',
  WEB_APP_USER_SENT_MESSAGE: 'web_app_user_sent_message',
};
