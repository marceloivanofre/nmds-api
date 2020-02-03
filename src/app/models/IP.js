const mongoosePaginate = require('mongoose-paginate-v2');
const moment = require('moment');
const { database: mongoose } = require('../../config');

moment.locale('pt-BR');

const { Schema, model } = mongoose;

const IPSchema = new Schema(
  {
    ip: {
      type: String,
      required: true
    },
    use: {
      type: String,
      maxlength: 45,
      required: true
    },
    provider: {
      type: Schema.Types.ObjectId,
      required: true
    },
    gateway: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true
  }
);

IPSchema.plugin(mongoosePaginate);

module.exports = model('ip', IPSchema);
