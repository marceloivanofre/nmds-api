const Joi = require('@hapi/joi');
const { ObjectId } = require('mongoose').Types;
const { Netmask } = require('netmask');

const { Provider, IP } = require('../models');
const validate = require('../validators');

module.exports = {
  async store(req, res) {
    try {
      await Joi.validate(
        {
          name: req.body.name,
          ip: req.body.ip,
          mask: req.body.mask
        },
        validate.Provider.create
      );

      if (!ObjectId.isValid(req.body.campus)) {
        return res.status(400).json({ message: 'Câmpus inválido' });
      }

      const existsProviderIP = await Provider.findOne({
        ip: req.body.ip
      });

      if (existsProviderIP) {
        return res
          .status(400)
          .json({ message: 'Link já cadastrado' });
      }

      const block = new Netmask(`${req.body.ip}/${req.body.mask}`);

      const provider = await Provider.create({ ...req.body });

      block.forEach(async (ip, long, index) => {
        let gateway = false;

        if (index === 0) {
          gateway = true;
        }

        await IP.create({
          ip,
          use: '-',
          provider: provider._id,
          gateway
        });
      });

      return res.status(200).json({ provider });
    } catch (err) {
      if (err.status) {
        return res
          .status(500)
          .json({ message: 'Ocorreu um erro interno' });
      }

      return res.status(400).json({ message: err.message });
    }
  },

  async index(req, res) {
    try {
      if (!ObjectId.isValid(req.query.campus)) {
        return res.status(400).json({ message: 'Câmpus inválido' });
      }

      const providers = await Provider.find({
        campus: req.query.campus
      });

      return res.status(200).json(providers);
    } catch (err) {
      return res
        .status(400)
        .json({ message: 'Ocorreu um erro interno' });
    }
  },

  async update(req, res) {
    try {
      await Joi.validate(
        {
          name: req.body.name
        },
        validate.Provider.update
      );

      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Provedor inválido' });
      }

      await Provider.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          name: req.body.name
        }
      );

      return res
        .status(200)
        .json({ message: 'Provedor atualizado com sucesso' });
    } catch (err) {
      if (err.status) {
        return res
          .status(500)
          .json({ message: 'Ocorreu um erro interno' });
      }

      return res.status(400).json({ message: err.message });
    }
  },

  async delete(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Provedor inválido' });
      }

      await Provider.deleteOne({
        _id: req.params.id
      });

      return res
        .status(200)
        .json({ message: 'Provedor excluído com sucesso' });
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro interno' });
    }
  }
};
