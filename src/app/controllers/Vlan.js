const Joi = require('@hapi/joi');
const { ObjectId } = require('mongoose').Types;

const { Vlan, Campus } = require('../models');

const validate = require('../validators');

module.exports = {
  async create(req, res) {
    try {
      const vlan = { ...req.body };

      await Joi.validate(
        {
          ip: vlan.ip,
          vlan_id: vlan.vlan_id,
          description: vlan.description,
          mask: vlan.mask,
          dhcp: vlan.dhcp,
          color: vlan.color
        },
        validate.Vlan.create
      );

      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Campus inválido' });
      }

      const existsCampus = await Campus.findOne({
        _id: req.params.id
      });

      if (!existsCampus) {
        return res.status(400).json({ message: 'Campus inválido' });
      }

      const isMatchIpDefault = vlan.ip.search(
        existsCampus.ip_default
      );

      if (isMatchIpDefault !== 0) {
        return res
          .status(400)
          .json({ message: 'IP não confere com o Câmpus' });
      }
      const regex = `.${vlan.vlan_id}.`;

      const isMatchVlanId = vlan.ip.search(regex);

      if (isMatchVlanId < 0) {
        return res
          .status(400)
          .json({ message: 'ID da VLAN não confere' });
      }

      if (vlan.vpn && !req.user.admin) {
        return res
          .status(400)
          .json({ message: 'Usuário não autorizado a criar VPN' });
      }

      const existsIp = await Vlan.findOne({ ip: vlan.ip });

      if (existsIp) {
        return res.status(400).json({ message: 'IP já cadastrado' });
      }

      vlan.campus = req.params.id;

      await Vlan.create(vlan);

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
    const vlan = { ...req.body };
    const updatedVlan = {};

    try {
      await Joi.validate(
        {
          vlan_id: vlan.vlan_id,
          description: vlan.description,
          mask: vlan.mask,
          dhcp: vlan.dhcp,
          color: vlan.color
        },
        validate.Vlan.update
      );

      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'VLAN inválido' });
      }

      const defaultVlan = await Vlan.findOne({
        _id: req.params.id
      });

      if (!defaultVlan) {
        return res.status(400).json({ message: 'VLAN inválida' });
      }

      if (vlan.ip) {
        const existsIp = await Vlan.find({ ip: vlan.ip });
        if (existsIp.length > 1) {
          return res
            .status(400)
            .json({ message: 'IP já cadastrado' });
        }

        updatedVlan.ip = vlan.ip;
      }

      if (vlan.vlan_id) {
        updatedVlan.vlan_id = vlan.vlan_id;
      }

      if (vlan.description) {
        updatedVlan.description = vlan.description;
      }

      if (vlan.mask) {
        updatedVlan.mask = vlan.mask;
      }

      if ('dhcp' in vlan) {
        updatedVlan.dhcp = vlan.dhcp;
      }

      if (vlan.color) {
        updatedVlan.color = vlan.color;
      }

      await Vlan.findOneAndUpdate(
        { _id: req.params.id },
        updatedVlan
      );

      return res
        .status(200)
        .json({ message: 'VLAN atualizada com sucesso' });
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
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Câmpus inválido' });
      }
      const vlans = await Vlan.find({
        campus: req.params.id
      });
      return res.status(200).json(vlans);
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro interno' });
    }
  },
  async delete(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Vlan inválida' });
      }

      await Vlan.deleteOne({ _id: req.params.id });
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
