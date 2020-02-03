const Joi = require('@hapi/joi');

module.exports = {
  create: Joi.object().keys({
    number_doors: Joi.number()
      .min(1)
      .max(48)
      .required()
      .error(new Error('Número de portas inválido')),
    brand: Joi.string()
      .trim()
      .max(45)
      .required()
      .error(new Error('Marca inválida')),
    model: Joi.string()
      .trim()
      .max(45)
      .required()
      .error(new Error('Modelo inválido')),
    row_position: Joi.boolean()
      .required()
      .error(new Error('Posição da linha inválida')),
    column_position: Joi.boolean()
      .required()
      .error(new Error('Posição da coluna inválida')),
    number_line: Joi.number()
      .integer()
      .min(1)
      .max(2)
      .required()
      .error(new Error('Número de linhas inválida'))
  }),
  update: Joi.object().keys({
    number_doors: Joi.number()
      .min(1)
      .max(48)
      .error(new Error('Número de portas inválido')),
    brand: Joi.string()
      .trim()
      .max(45)
      .error(new Error('Marca inválida')),
    model: Joi.string()
      .trim()
      .max(45)
      .error(new Error('Modelo inválido')),
    row_position: Joi.boolean().error(
      new Error('Posição da linha inválida')
    ),
    column_position: Joi.boolean().error(
      new Error('Posição da coluna inválida')
    ),
    number_line: Joi.number()
      .integer()
      .min(1)
      .max(2)
      .error(new Error('Número de linhas inválida'))
  })
};
