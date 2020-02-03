const Joi = require('@hapi/joi');
const { ObjectId } = require('mongoose').Types;

const { Vpn } = require('../models');

const validate = require('../validators');

module.exports = {
  async create(req, res) {
    try {
      const vpn = { ...req.body };

      await Joi.validate(vpn, validate.Vpn.create);

      await Vpn.create(vpn);

      return res.status(200).json({ message: 'ok' });
    } catch (err) {
      if (err.status) {
        return res
          .status(500)
          .json({ message: 'Ocorreu um erro interno' });
      }

      return res.status(400).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const vpn = { ...req.body };
      const updatedVpn = {};

      await Joi.validate(vpn, validate.Vpn.update);

      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'VPN inválido' });
      }

      const defaultVpn = await Vpn.findOne({
        _id: req.params.id
      });

      if (!defaultVpn) {
        return res
          .status(400)
          .json({ message: 'VPN não cadastrada' });
      }

      if (vpn.vlan_id) {
        updatedVpn.vlan_id = vpn.vlan_id;
      }

      if (vpn.description) {
        updatedVpn.description = vpn.description;
      }

      if (vpn.color) {
        updatedVpn.color = vpn.color;
      }

      await Vpn.findOneAndUpdate(
        {
          _id: req.params.id
        },
        updatedVpn
      );

      return res
        .status(200)
        .json({ message: 'VPN atualizado com sucesso' });
    } catch (err) {
      if (err.status) {
        return res
          .status(500)
          .json({ message: 'Ocorreu um erro interno' });
      }

      return res.status(400).json({ message: err.message });
    }
  },
  async getAll(req, res) {
    try {
      const vpns = await Vpn.find();
      return res.status(200).json(vpns);
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro interno' });
    }
  },
  async delete(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'VPN inválida' });
      }

      await Vpn.deleteOne({ _id: req.params.id });
      return res
        .status(200)
        .json({ message: 'Deletado com sucesso' });
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro interno' });
    }
  }
};
