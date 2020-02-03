const Joi = require('@hapi/joi');

module.exports = {
  create: Joi.object().keys({
    name: Joi.string()
      .trim()
      .max(45)
      .required()
      .error(new Error('Nome inválido')),
    abbreviation: Joi.string()
      .regex(/^[a-zA-Z]{3}$/)
      .required()
      .error(new Error('Sigla inválida')),
    ip_default: Joi.string()
      .regex(/^\d{1,3}(\.\d{1,3})$/)
      .required()
      .error(new Error('Padrão de IP inválido'))
  }),

  update: Joi.object().keys({
    name: Joi.string()
      .trim()
      .max(45)
      .error(new Error('Nome inválido')),
    abbreviation: Joi.string()
      .regex(/^[a-zA-Z]{3}$/)
      .error(new Error('Sigla inválida')),
    ip_default: Joi.string()
      .regex(/^\d{1,3}(\.\d{1,3})$/)
      .required()
      .error(new Error('Padrão de IP inválido'))
  })
};
