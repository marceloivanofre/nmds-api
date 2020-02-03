const Joi = require('@hapi/joi');
const { ObjectId } = require('mongoose').Types;

const { Equipment } = require('../models');

const validate = require('../validators');

module.exports = {
  async create(req, res) {
    try {
      const equipment = { ...req.body };

      await Joi.validate(
        {
          number_doors: equipment.number_doors,
          brand: equipment.brand,
          model: equipment.model,
          row_position: equipment.row_position,
          column_position: equipment.column_position,
          number_line: equipment.number_line
        },
        validate.Equipment.create
      );

      await Equipment.create(equipment);

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
    const equipment = { ...req.body };
    const updatedEquipment = {};

    try {
      await Joi.validate(
        {
          number_doors: equipment.number_doors,
          brand: equipment.brand,
          model: equipment.model,
          row_position: equipment.row_position,
          column_position: equipment.column_position,
          number_line: equipment.number_line
        },
        validate.Equipment.update
      );

      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Switch inválido' });
      }

      const defaultEquipment = await Equipment.findOne({
        _id: req.params.id
      });

      if (!defaultEquipment) {
        return res.status(400).json({ message: 'Switch inválida' });
      }

      if (equipment.number_doors) {
        updatedEquipment.number_doors = equipment.number_doors;
      }

      if (equipment.brand) {
        updatedEquipment.brand = equipment.brand;
      }

      if (equipment.model) {
        updatedEquipment.model = equipment.model;
      }

      if (equipment.row_position) {
        updatedEquipment.row_position = equipment.row_position;
      }

      if (equipment.column_position) {
        updatedEquipment.column_position = equipment.column_position;
      }

      if (equipment.number_line) {
        updatedEquipment.number_line = equipment.number_line;
      }

      await Equipment.findOneAndUpdate(
        { _id: req.params.id },
        updatedEquipment
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
      const equipments = await Equipment.find();
      return res.status(200).json(equipments);
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro interno' });
    }
  },
  async delete(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Switch inválida' });
      }

      await Equipment.deleteOne({ _id: req.params.id });
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
