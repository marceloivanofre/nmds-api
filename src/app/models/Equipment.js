const { database: mongoose } = require('../../config');

const { Schema, model } = mongoose;

const equipment = new Schema(
  {
    brand: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    number_doors: {
      type: Number,
      required: true
    },
    row_position: {
      type: Boolean,
      required: true
    },
    column_position: {
      type: Boolean,
      required: true
    },
    number_line: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('equipments', equipment);
