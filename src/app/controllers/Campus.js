const Joi = require('@hapi/joi');

const { Campus, User, Log } = require('../models');
const validate = require('../validators');

module.exports = {
  async store(req, res) {
    const { name, abbreviation, ip_default } = { ...req.body };

    try {
      const campus = await Joi.validate(
        {
          name,
          abbreviation,
          ip_default
        },
        validate.Campus.create
      );

      const campusExists = await Campus.findOne({
        abbreviation: abbreviation.toLowerCase()
      });

      if (campusExists) {
        return res
          .status(400)
          .json({ message: 'Campus já cadastrado' });
      }

      await Campus.create({
        name: campus.name,
        abbreviation: campus.abbreviation,
        ip_default
      });

      return res
        .status(200)
        .json({ message: 'Campus criado com sucesso' });
    } catch (err) {
      await Log.create({
        endpoint: req.path,
        input: req.body,
        user: req.user.id,
        message: err
      });
      if (err.status) {
        return res
          .status(500)
          .json({ message: 'Ocorreu um erro interno' });
      }

      return res.status(400).json({ message: err.message });
    }
  },
  async index(req, res) {
    const filters = {};

    if (req.query.abbreviation) {
      filters.abbreviation = new RegExp(req.query.abbreviation, 'i');
    }

    if (req.query.name) {
      filters.name = new RegExp(req.query.name, 'i');
    }

    try {
      const response = await Campus.paginate(filters, {
        page: req.query.page || 1,
        limit: 50,
        sort: '-createdAt'
      });

      res.status(200).json(response);
    } catch (err) {
      await Log.create({
        endpoint: req.path,
        input: req.body,
        user: req.user.id,
        message: err
      });
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro interno' });
    }
  },

  async show(req, res) {
    try {
      const campus = await Campus.findOne({
        _id: req.params.id
      });

      return res.status(200).json({ campus });
    } catch (err) {
      await Log.create({
        endpoint: req.path,
        input: req.body,
        user: req.user.id,
        message: err
      });
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro interno' });
    }
  },

  async delete(req, res) {
    const campus = req.params.id;

    try {
      await Campus.deleteOne({ _id: campus });
      return res
        .status(200)
        .json({ message: 'Campus deletado com sucesso' });
    } catch (err) {
      await Log.create({
        endpoint: req.path,
        input: req.body,
        user: req.user.id,
        message: err
      });
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro interno' });
    }
  },

  async update(req, res) {
    const campusUpdated = {};

    const { name, abbreviation, ip_default } = req.body;
    const { id } = req.params;

    if (name) {
      campusUpdated.name = name;
    }

    if (abbreviation) {
      campusUpdated.abbreviation = abbreviation;
    }

    if (ip_default) {
      campusUpdated.ip_default = ip_default;
    }

    try {
      await Joi.validate(campusUpdated, validate.Campus.update);

      const user = await User.findOne({
        _id: req.user.id
      });

      if (!req.user.admin) {
        if (user.campus.toString() !== id) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      }

      await Campus.findByIdAndUpdate(id, campusUpdated, {
        new: true
      });

      return res
        .status(200)
        .json({ message: 'Campus atualizado com sucesso' });
    } catch (err) {
      await Log.create({
        endpoint: req.path,
        input: req.body,
        user: req.user.id,
        message: err
      });
      if (err.status) {
        return res
          .status(500)
          .json({ message: 'Ocorreu um erro interno' });
      }

      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Usuário inválido' });
      }

      return res.status(400).json({ message: err.message });
    }
  }
};
