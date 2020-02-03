const Joi = require('@hapi/joi');

module.exports = {
  signin: Joi.object().keys({
    prontuario: Joi.string()
      .trim()
      .regex(/^[a-zA-Z]{2}\d{6}$/)
      .required()
      .error(new Error('Prontuario inválido')),
    password: Joi.string()
      .trim()
      .max(100)
      .required()
      .error(new Error('Senha inválida'))
  })
};
