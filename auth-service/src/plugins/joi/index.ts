import JoiBase from 'joi';
import JoiDate from '@joi/date';

const joiDateExtension = (joi) => {
  return {
    ...JoiDate(joi),
    prepare: (value) => {
      if (value !== null && value !== undefined && typeof value !== 'string') {
        value = value.toString();
      }
      return { value };
    },
  };
};

const Joi = JoiBase.extend(joiDateExtension);
export default Joi;
