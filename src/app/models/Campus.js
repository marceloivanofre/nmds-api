const mongoosePaginate = require('mongoose-paginate-v2');
const { database: mongoose } = require('../../config');

const { Schema, model } = mongoose;

const CampusSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    abbreviation: {
      type: String,
      required: true,
      lowercase: true
    },
    ip_default: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

CampusSchema.plugin(mongoosePaginate);

module.exports = model('campus', CampusSchema);
