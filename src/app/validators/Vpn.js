const Joi = require('@hapi/joi');

module.exports = {
  create: Joi.object().keys({
    vlan_id: Joi.number()
      .min(1)
      .max(255)
      .required()
      .error(new Error('ID do vlan inválido')),
    description: Joi.string()
      .trim()
      .max(45)
      .required()
      .error(new Error('Descrição inválido')),
    color: Joi.string()
      .trim()
      .min(7)
      .max(7)
      .required()
      .error(new Error('Cor inválida'))
  }),
  update: Joi.object().keys({
    vlan_id: Joi.number()
      .min(1)
      .max(255)
      .error(new Error('ID do vlan inválido')),
    description: Joi.string()
      .trim()
      .max(45)
      .error(new Error('Descrição inválido')),
    color: Joi.string()
      .trim()
      .min(7)
      .max(7)
      .error(new Error('Cor inválida'))
  })
};
