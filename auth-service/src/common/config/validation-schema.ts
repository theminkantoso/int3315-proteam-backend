import Joi from 'joi';
import { NODE_ENV } from '../constants';
import ConfigKey from './config-key';

export default Joi.object({
    [ConfigKey.PORT]: Joi.number().default(3000),
    [ConfigKey.VERSION]: Joi.string().required(),
    [ConfigKey.NAME]: Joi.string().required(),
    [ConfigKey.BASE_PATH]: Joi.string().required(),
    [ConfigKey.CORS_WHITELIST]: Joi.string().required(),
    [ConfigKey.LOG_LEVEL]: Joi.string()
        .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
        .required(),
    [ConfigKey.WEB_APP_BASE_URL]: Joi.string().required(),
    [ConfigKey.DB_HOST]: Joi.string().required(),
    [ConfigKey.DB_PORT]: Joi.number().required(),
    [ConfigKey.DB_USERNAME]: Joi.string().required(),
    [ConfigKey.DB_PASSWORD]: Joi.string().allow(''),
    [ConfigKey.DB_NAME]: Joi.string().required(),
    [ConfigKey.NODE_ENV]: Joi.string()
        .valid(...Object.values(NODE_ENV))
        .required(),
    [ConfigKey.JWT_SECRET_ACCESS_TOKEN_KEY]: Joi.string().required(),
    [ConfigKey.JWT_SECRET_REFRESH_TOKEN_KEY]: Joi.string().required(),
    [ConfigKey.TOKEN_EXPIRED_IN]: Joi.number().required(),
    [ConfigKey.REFRESH_TOKEN_EXPIRED_IN]: Joi.number().required(),
    [ConfigKey.GOOGLE_CLIENT_ID]: Joi.string().required(),
    [ConfigKey.GOOGLE_CLIENT_SECRET]: Joi.string().required(),
    [ConfigKey.AWS_ACCESS_KEY_ID]: Joi.string().required(),
    [ConfigKey.AWS_SECRET_ACCESS_KEY]: Joi.string().required(),
    [ConfigKey.AWS_REGION]: Joi.string().required(),
    [ConfigKey.AWS_S3_BUCKET]: Joi.string().required(),
    [ConfigKey.AWS_S3_DOMAIN]: Joi.string().required(),
});