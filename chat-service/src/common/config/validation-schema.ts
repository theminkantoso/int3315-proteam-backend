import Joi from 'joi';
import ConfigKey from './config-key';

export default Joi.object({
  [ConfigKey.PORT]: Joi.number().default(3000),
  [ConfigKey.VERSION]: Joi.string().required(),
  [ConfigKey.NAME]: Joi.string().required(),
  [ConfigKey.BASE_PATH]: Joi.string().required(),
  [ConfigKey.JWT_SECRET_ACCESS_TOKEN_KEY]: Joi.string().required(),
});
