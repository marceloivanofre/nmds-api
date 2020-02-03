const { database: mongoose } = require('../../config');

const { Schema, model } = mongoose;

const Vlan = new Schema(
  {
    ip: {
      type: String,
      required: true
    },
    vlan_id: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    mask: {
      type: String,
      required: true
    },
    dhcp: {
      type: Boolean,
      required: true
    },
    vpn: {
      type: Boolean,
      required: true,
      default: false
    },
    color: {
      type: String,
      required: true
    },
    campus: {
      type: Schema.Types.ObjectId,
      ref: 'campus',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('vlans', Vlan);
