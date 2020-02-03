const mongoosePaginate = require('mongoose-paginate-v2');
const moment = require('moment');
const { database: mongoose } = require('../../config');
moment.locale('pt-BR');

const { Schema, model } = mongoose;

const ProviderSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    ip: {
      type: String,
      required: true
    },
    mask: {
      type: String,
      maxlength: 2,
      required: true
    },
    campus: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true
  }
);

ProviderSchema.plugin(mongoosePaginate);

module.exports = model('provider', ProviderSchema);
