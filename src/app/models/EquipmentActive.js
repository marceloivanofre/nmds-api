const { database: mongoose } = require('../../config');

const { Schema, model } = mongoose;

const equipment = new Schema(
  {
    campus: {
      type: Schema.Types.ObjectId,
      ref: 'campus',
      required: true
    },
    place: {
      type: String,
      required: true
    },
    ip: {
      type: String,
      required: true
    },
    user: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    equipment: {
      type: Schema.Types.ObjectId,
      ref: 'equipments',
      required: true
    },
    doors: [
      {
        vlans: [
          {
            type: String
          }
        ]
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = model('equipmentActive', equipment);
