const Joi = require('@hapi/joi');
const { ObjectId } = require('mongoose').Types;

const {
  Equipment,
  Vlan,
  EquipmentActive,
  Campus
} = require('../models');

const validate = require('../validators');

module.exports = {
  async create(req, res) {
    try {
      const equipment = { ...req.body };

      await Joi.validate(
        {
          place: equipment.place,
          ip: equipment.ip,
          user: equipment.user,
          password: equipment.password
        },
        validate.EquipmentActive.create
      );

      if (!ObjectId.isValid(equipment.equipment)) {
        return res
          .status(400)
          .json({ message: 'Equipamento inválido' });
      }

      const existsEquipment = await Equipment.findOne({
        _id: equipment.equipment
      });

      if (!existsEquipment) {
        return res
          .status(400)
          .json({ message: 'Equipamento inválido' });
      }

      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Câmpus inválido' });
      }

      const existsCampus = Campus.findOne({
        _id: req.params.id
      });

      if (!existsCampus) {
        return res.status(400).json({ message: 'Câmpus inválido' });
      }

      equipment.campus = req.params.id;
      equipment.doors = [];

      for (let i = 0; i < existsEquipment.number_doors; i++) {
        equipment.doors.push({ vlans: [''] });
      }

      await EquipmentActive.create(equipment);

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
  async updateDoors(req, res) {
    try {
      const { doors } = req.body;
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Câmpus inválido' });
      }

      const existsEquipment = EquipmentActive.findOne({
        _id: req.params.id
      });

      if (!existsEquipment) {
        return res
          .status(400)
          .json({ message: 'Equipamento inválido' });
      }

      if (doors && doors.length) {
        var teste = await EquipmentActive.findOneAndUpdate(
          {
            _id: req.params.id
          },
          {
            doors
          }
        );
      }
      return res.status(200).json({ message: 'ok' });
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro interno' });
    }
  },
  async update(req, res) {
    const equipment = { ...req.body };

    try {
      await Joi.validate(
        {
          place: equipment.place,
          ip: equipment.ip,
          user: equipment.user,
          password: equipment.password
        },
        validate.EquipmentActive.update
      );

      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Switch inválido' });
      }

      const defaultEquipment = await EquipmentActive.findOne({
        _id: req.params.id
      });

      if (!defaultEquipment) {
        return res.status(400).json({ message: 'Switch inválida' });
      }

      if (equipment.place) {
        defaultEquipment.place = equipment.place;
      }

      if (equipment.ip) {
        defaultEquipment.ip = equipment.ip;
      }

      if (equipment.user) {
        defaultEquipment.user = equipment.user;
      }

      if (equipment.password) {
        defaultEquipment.password = equipment.password;
      }

      if (!ObjectId.isValid(equipment.equipment)) {
        return res
          .status(400)
          .json({ message: 'Modelo de equipamento inválido' });
      }

      const existsEquipment = await Equipment.findOne({
        _id: equipment.equipment
      });

      if (!existsEquipment) {
        return res
          .status(400)
          .json({ message: 'Modelo de equipamento inválido' });
      }

      await EquipmentActive.findOneAndUpdate(
        { _id: req.params.id },
        defaultEquipment
      );

      return res
        .status(200)
        .json({ message: 'Switch atualizado com sucesso' });
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

      const equipments = await EquipmentActive.find({
        campus: req.params.id
      }).populate('equipment');
      return res.status(200).json(equipments);
    } catch (err) {
      if (err.status) {
        return res
          .status(500)
          .json({ message: 'Ocorreu um erro interno' });
      }

      return res.status(400).json({ message: err.message });
    }
  },
  async get(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Câmpus inválido' });
      }

      if (!ObjectId.isValid(req.params.equipmentId)) {
        return res
          .status(400)
          .json({ message: 'Equipamento inválido' });
      }

      const equipment = await EquipmentActive.findOne({
        _id: req.params.equipmentId
      }).populate('equipment');

      return res.status(200).json(equipment);
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
        return res.status(400).json({ message: 'Switch inválido' });
      }

      await EquipmentActive.deleteOne({ _id: req.params.id });
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
