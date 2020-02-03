const Joi = require('@hapi/joi');
const crypto = require('crypto');

const validate = require('../validators');
const { User, Token, Log } = require('../models');
const Mail = require('../services/Mail');

module.exports = {
  async forgotPassword(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(400).json({
          message: 'Não existe uma conta associada a esse email'
        });
      }

      const expires = new Date();
      expires.setHours(expires.getHours() + 1);

      const dataToken = await Token.create({
        token: crypto.randomBytes(20).toString('hex'),
        resetPassword: true,
        user: user.id,
        expires
      });

      await Mail.sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: 'Redefinição de senha',
        template: 'recoveryPass',
        context: { user, code: dataToken.token }
      });

      return res
        .status(200)
        .json({ message: 'Código de recuperação enviado' });
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

  async resetPassword(req, res) {
    const { token } = req.query;
    const { password, confirmPassword } = req.body;

    try {
      const dataToken = await Token.findOne({ token });
      if (!dataToken || !dataToken.resetPassword) {
        return res.status(400).json({ message: 'Token inválido' });
      }

      const now = new Date();
      if (now > dataToken.expires) {
        return res.status(400).json({ message: 'Token expirado' });
      }

      console.log(password);
      await Joi.validate(
        {
          password
        },
        validate.User.updatePassword
      );

      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ message: 'As senhas não conferem' });
      }

      await User.findByIdAndUpdate(dataToken.user, {
        password
      });

      await Token.findByIdAndDelete(dataToken._id);
      return res
        .status(200)
        .json({ message: 'Senha redefinida com sucesso' });
    } catch (err) {
      await Log.create({
        endpoint: req.path,
        input: req.body,
        user: req.user.id,
        message: err
      });
      if (err.status) {
        res.status(500).json({ message: 'Ocorreu um erro interno' });
      }

      res.status(400).json({ message: err.message });
    }
  },

  async confirmAccount(req, res) {
    const { token } = req.body;

    try {
      const dataToken = await Token.findOne({ token });

      if (!dataToken || !dataToken.confirmAccount) {
        return res.status(400).json({ message: 'Token inválido' });
      }

      const now = new Date();
      if (now > dataToken.expires) {
        return res.status(400).json({ message: 'Token expirado' });
      }

      await User.findByIdAndUpdate(
        dataToken.user,
        {
          confirmed: true
        },
        {
          new: true
        }
      );

      await Token.findByIdAndDelete(dataToken._id);
      return res
        .status(200)
        .json({ message: 'Conta verificada com sucesso' });
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
  }
};
