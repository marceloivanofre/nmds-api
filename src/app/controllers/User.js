const Joi = require('@hapi/joi');
const crypto = require('crypto');

const { User, Token, Campus, Log } = require('../models');
const Mail = require('../services/Mail');
const validate = require('../validators');

module.exports = {
  async firstAccess(req, res) {
    const adminExists = await User.find();
    const admin = !adminExists.length;

    if (!admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.status(200).json({ message: 'ok' });
  },

  async adminRegister(req, res) {
    const user = { ...req.body };

    try {
      const adminExists = await User.find();
      const admin = !adminExists.length;

      if (!admin) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const value = await Joi.validate(
        {
          name: user.name,
          email: user.email,
          password: user.password,
          prontuario: user.prontuario
        },
        validate.User.create
      );

      if (value.password !== user.confirmPassword) {
        return res
          .status(400)
          .json({ message: 'As senhas não conferem' });
      }

      const response = await User.create({
        name: value.name,
        email: value.email,
        password: value.password,
        admin,
        prontuario: value.prontuario,
        campus: user.campus,
        confirmed: false
      });

      const expires = new Date();
      expires.setHours(expires.getHours() + 8760);

      const dataToken = await Token.create({
        token: crypto.randomBytes(20).toString('hex'),
        confirmAccount: true,
        user: response._id,
        expires
      });

      await Mail.sendMail({
        from: process.env.MAIL_USER,
        to: value.email,
        subject: 'Confirmação de conta',
        template: 'confirmEmail',
        context: { user: value, code: dataToken.token }
      });

      return res.status(200).json({
        message: 'Conta criada e código de verificação enviado'
      });
    } catch (err) {
      if (err.status) {
        return res
          .status(500)
          .json({ message: 'Ocorreu um erro interno' });
      }

      return res.status(400).json({ message: err.message });
    }
  },
  async store(req, res) {
    try {
      const user = await Joi.validate(
        {
          name: req.body.name,
          email: req.body.email,
          prontuario: req.body.prontuario
        },
        validate.User.create
      );

      const campusExists = await Campus.findOne({
        _id: req.body.campus
      });

      if (!campusExists) {
        return res.status(400).json({ message: 'Campus inválido' });
      }

      user.campus = req.body.campus;

      const userExists = await User.findOne({
        $or: [
          {
            email: user.email
          },
          {
            prontuario: user.prontuario
          }
        ]
      });

      if (userExists) {
        return res
          .status(400)
          .json({ message: 'Usuário já cadastrado' });
      }

      user.password = crypto.randomBytes(10).toString('hex');

      await User.create({
        name: user.name,
        email: user.email,
        prontuario: user.prontuario,
        password: user.password,
        admin: false,
        confirmed: true,
        campus: user.campus
      });

      await Mail.sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: 'Aviso de registro',
        template: 'sendPass',
        context: { name: user.name, code: user.password }
      });

      return res
        .status(200)
        .json({ message: 'Usuário criado com sucesso' });
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
        return res.status(400).json({ message: 'Campus inválido' });
      }

      return res.status(400).json({ message: err.message });
    }
  },

  async index(req, res) {
    try {
      const users = await User.aggregate([
        {
          $match: { admin: false }
        },
        {
          $lookup: {
            from: 'campus',
            localField: 'campus',
            foreignField: '_id',
            as: 'campus'
          }
        }
      ]);

      return res.status(200).json(users);
    } catch (err) {
      await Log.create({
        endpoint: req.path,
        input: req.body,
        user: req.user.id,
        message: err
      });
      return res.status(500).json({ message: err.message });
    }
  },

  async show(req, res) {
    try {
      const user = await User.findOne({
        _id: req.user.id
      });

      return res.status(200).json({ user });
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
    const user = req.params.id;

    try {
      await User.deleteOne({ _id: user });
      return res
        .status(200)
        .json({ message: 'Usuário deletado com sucesso' });
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
    const userUpdated = {};

    const {
      name,
      email,
      campus,
      password,
      confirmPassword
    } = req.body;

    if (name) {
      userUpdated.name = name;
    }

    if (email) {
      userUpdated.email = email;
    }

    if (password) {
      userUpdated.password = password;
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ message: 'As senhas não conferem' });
      }
    }

    const { id } = req.params;

    if (req.user.id !== id) {
      if (!req.user.admin) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    }

    try {
      await Joi.validate(userUpdated, validate.User.updateUser);

      if (campus) {
        const campusExists = await Campus.findOne({
          _id: campus
        });

        if (!campusExists) {
          return res.status(400).json({ message: 'Campus inválido' });
        }
        userUpdated.campus = campus;
      }

      await User.findByIdAndUpdate(id, userUpdated, {
        new: true
      });

      return res
        .status(200)
        .json({ message: 'Usuário atualizado com sucesso' });
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
        return res.status(400).json({ message: 'Campus inválido' });
      }

      return res.status(400).json({ message: err.message });
    }
  }
};
