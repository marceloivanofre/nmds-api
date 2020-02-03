const Joi = require('@hapi/joi');

module.exports = {
  create: Joi.object().keys({
    place: Joi.string()
      .trim()
      .max(45)
      .required()
      .error(new Error('Local inválido')),
    ip: Joi.string()
      .regex(/^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/)
      .error(new Error('IP inválido')),
    user: Joi.string()
      .trim()
      .max(45)
      .required()
      .error(new Error('Usuário inválido')),
    password: Joi.string()
      .trim()
      .max(45)
      .required()
      .error(new Error('Senha inválida'))
  }),
  update: Joi.object().keys({
    place: Joi.string()
      .trim()
      .max(45)
      .error(new Error('Local inválido')),
    ip: Joi.string()
      .regex(/^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/)
      .error(new Error('IP inválido')),
    user: Joi.string()
      .trim()
      .max(45)
      .error(new Error('Usuário inválido')),
    password: Joi.string()
      .trim()
      .max(45)
      .error(new Error('Senha inválida'))
  })
};
