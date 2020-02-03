const mongoosePaginate = require('mongoose-paginate-v2');
const { database: mongoose } = require('../../config');
const moment = require('moment');
moment.locale('pt-BR');

const { Schema, model } = mongoose;

const LogSchema = new Schema(
  {
    endpoint: {
      type: String,
      lowercase: true,
      required: true
    },
    input: {
      type: Object,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      default: moment().format()
    }
  },
  {
    timestamps: false
  }
);

LogSchema.plugin(mongoosePaginate);

module.exports = model('log', LogSchema);
