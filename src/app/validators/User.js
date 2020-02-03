const Joi = require('@hapi/joi');

module.exports = {
  create: Joi.object().keys({
    name: Joi.string()
      .trim()
      .max(45)
      .required()
      .error(new Error('Nome inválido')),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .error(new Error('Email inválido')),
    password: Joi.string()
      .trim()
      .max(50)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}/
      )
      .error(new Error('Senha inválida')),
    prontuario: Joi.string()
      .trim()
      .regex(/^[a-zA-Z]{2}\d{6}$/)
      .required()
      .error(new Error('Prontuario inválido'))
  }),

  updatePassword: Joi.object().keys({
    password: Joi.string()
      .trim()
      .max(50)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}/
      )
      .required()
      .error(new Error('Senha inválida'))
  }),

  updateUser: Joi.object().keys({
    name: Joi.string()
      .trim()
      .max(45)
      .error(new Error('Nome inválido')),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .error(new Error('Email inválido')),
    password: Joi.string()
      .trim()
      .max(50)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}/
      )
      .error(new Error('Senha inválida'))
  })
};
