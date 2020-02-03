const os = require('os');
const moment = require('moment');
const mongoose = require('../../config/database');
const { Log } = require('../models');
moment.locale('pt-BR');

module.exports = {
  async logs(req, res) {
    const filters = {};

    if (req.query.date) {
      const start = moment(req.query.date);
      const end = moment(start).add(24, 'hours');

      filters.createdAt = {
        $gte: start,
        $lt: end
      };
    }

    try {
      const logs = await Log.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        }
      ]);

      return res.status(200).json(logs);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  async status(req, res) {
    const freemem = os.freemem() / 1024 / 1024;
    const totalmem = os.totalmem() / 1024 / 1024;
    const uptime = os.uptime() / 60 / 60 / 24;

    try {
      const connection = await mongoose.connection;

      connection.db.stats(function(err, status) {
        if (err) {
          throw new Error('Ocorreu um erro interno');
        }
        return res.status(200).json({
          database: { ...status },
          system: { ...osInfo() }
        });
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro interno' });
    }

    function osInfo() {
      return {
        architecture: os.arch(),
        platform: os.platform,
        distro: os.release(),
        cpus: os.cpus().length,
        freeMemoryMb: freemem.toFixed(0),
        totalMemoryMb: totalmem.toFixed(0),
        freeMemoryPer: ((freemem / totalmem) * 100).toFixed(2),
        memoryUsagePer: (100 - (freemem / totalmem) * 100).toFixed(2),
        uptimeDays: uptime.toFixed(0)
      };
    }
  }
};
