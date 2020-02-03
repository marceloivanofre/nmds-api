const Joi = require('@hapi/joi');

module.exports = {
  create: Joi.object().keys({
    name: Joi.string()
      .trim()
      .max(45)
      .required()
      .error(new Error('Nome inválido')),
    ip: Joi.string()
      .trim()
      .regex(/^\d{1,3}(\.\d{1,3}){3}$/)
      .required()
      .error(new Error('Ip inválido')),
    mask: Joi.number()
      .integer()
      .min(0)
      .max(32)
      .required()
      .error(new Error('Máscara inválida'))
  }),
  update: Joi.object().keys({
    name: Joi.string()
      .trim()
      .max(45)
      .required()
      .error(new Error('Nome inválido'))
  })
};
