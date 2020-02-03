const { database: mongoose } = require('../../config');

const { Schema, model } = mongoose;

const Tokens = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true
    },
    resetPassword: {
      type: Boolean,
      default: false
    },
    confirmAccount: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    expires: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('tokens', Tokens);
