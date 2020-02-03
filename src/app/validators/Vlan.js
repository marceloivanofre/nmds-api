const Joi = require('@hapi/joi');

module.exports = {
  create: Joi.object().keys({
    ip: Joi.string()
      .trim()
      .regex(/^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/)
      .error(new Error('IP inválido')),
    vlan_id: Joi.number()
      .min(1)
      .max(255)
      .required()
      .error(new Error('ID inválido')),
    description: Joi.string()
      .trim()
      .max(45)
      .required()
      .error(new Error('Descrição inválida')),
    mask: Joi.string()
      .trim()
      .max(45)
      .required()
      .error(new Error('Máscara inválida')),
    dhcp: Joi.boolean()
      .required()
      .error(new Error('DCHP inválido')),
    color: Joi.string()
      .trim()
      .min(7)
      .max(7)
      .required()
      .error(new Error('Cor inválida'))
  }),
  update: Joi.object().keys({
    ip: Joi.string()
      .regex(/^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/)
      .error(new Error('IP inválido')),
    vlan_id: Joi.number()
      .min(1)
      .max(255)
      .error(new Error('ID do vlan inválido')),
    description: Joi.string()
      .trim()
      .max(45)
      .error(new Error('Descrição inválido')),
    mask: Joi.string()
      .trim()
      .max(45)
      .error(new Error('Máscara inválida')),
    dhcp: Joi.boolean().error(new Error('DCHP inválido')),
    color: Joi.string()
      .trim()
      .min(7)
      .max(7)
      .error(new Error('Cor inválida'))
  })
};
