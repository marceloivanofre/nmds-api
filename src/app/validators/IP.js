const Joi = require('@hapi/joi');

module.exports = {
  update: Joi.object().keys({
    use: Joi.string()
      .max(45)
      .trim()
      .error(new Error('Uso do IP inválido')),
    gateway: Joi.boolean()
  })
};
