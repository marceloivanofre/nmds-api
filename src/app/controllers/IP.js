const Joi = require('@hapi/joi');
const { IP, Provider } = require('../models');
const { ObjectId } = require('mongoose').Types;
const validate = require('../validators');

module.exports = {
  async index(req, res) {
    try {
      if (!ObjectId.isValid(req.query.provider)) {
        return res.status(400).json({ message: 'Provedor inválido' });
      }
      const ips = await IP.find({
        provider: req.query.provider
      });

      return res.status(200).json(ips);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro interno' });
    }
  },
  async update(req, res) {
    try {
      await Joi.validate(
        {
          use: req.body.use,
          gateway: req.body.gateway
        },
        validate.IP.update
      );

      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'IP inválido' });
      }

      if (!ObjectId.isValid(req.body.provider)) {
        return res.status(400).json({ message: 'Provedor inválido' });
      }

      const existsProvider = await Provider.findOne({
        _id: req.body.provider
      });

      if (!existsProvider) {
        return res.status(400).json({ message: 'Provedor inválido' });
      }

      const ipBelongsProvider = await IP.findOne({
        _id: req.params.id,
        provider: req.body.provider
      });

      if (!ipBelongsProvider) {
        return res
          .status(400)
          .json({ message: 'IP não pertence ao provedor' });
      }

      const updateIP = {};

      if (req.body.use) {
        updateIP.use = req.body.use;
      }

      if (req.body.gateway) {
        const existsIP = await IP.findOneAndUpdate(
          {
            gateway: true,
            provider: req.body.provider
          },
          {
            gateway: false
          }
        );

        if (!existsIP) {
          return res
            .status(400)
            .json({ message: 'IP inválido para esse provedor' });
        }

        updateIP.gateway = true;
      }

      await IP.findOneAndUpdate(
        {
          _id: req.params.id
        },
        updateIP
      );

      return res
        .status(200)
        .json({ message: 'IP atualizado com sucesso' });
    } catch (err) {
      if (err.status) {
        return res
          .status(500)
          .json({ message: 'Ocorreu um erro interno' });
      }

      return res.status(400).json({ message: err.message });
    }
  }
};
