const { database: mongoose } = require('../../config');

const { Schema, model } = mongoose;

const Vpn = new Schema(
  {
    vlan_id: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('vpn', Vpn);
