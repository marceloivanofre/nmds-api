const jwt = require('jwt-simple');
const Joi = require('@hapi/joi');
const { User, Log } = require('../models');

const validate = require('../validators');

module.exports = {
  async store(req, res) {
    const { prontuario, password } = req.body;

    try {
      await Joi.validate(
        {
          prontuario,
          password
        },
        validate.Session.signin
      );

      const user = await User.findOne({ prontuario });

      if (!user) {
        return res
          .status(400)
          .json({ message: 'Usuário não encontrado' });
      }

      if (!(await user.compareHash(password))) {
        return res.status(400).json({ message: 'Senha inválida' });
      }

      if (!user.confirmed) {
        return res
          .status(400)
          .json({ message: 'Usuário não verificado' });
      }

      return res.status(200).json({
        token: User.generateToken(user)
      });
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
    const userData = req.body || null;
    try {
      if (userData) {
        const token = jwt.decode(
          userData.token,
          process.env.AUTH_SECRET
        );
        if (new Date(token.exp * 1000) > new Date()) {
          return res.status(200).json({ message: 'Token válido' });
        }
      }
    } catch (err) {
      await Log.create({
        endpoint: req.path,
        input: req.body,
        user: req.user.id,
        message: err
      });
    }

    res.status(400).json({ message: 'Token inválido' });
  }
};
