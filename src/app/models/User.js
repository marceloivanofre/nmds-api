const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const mongoosePaginate = require('mongoose-paginate-v2');
const { database: mongoose } = require('../../config');

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    admin: {
      type: Boolean,
      required: true
    },
    prontuario: {
      type: String,
      lowercase: true,
      required: true,
      unique: true
    },
    campus: {
      type: mongoose.Schema.Types.ObjectId
    },
    confirmed: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true
  }
);

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 8);
});

UserSchema.pre('findOneAndUpdate', async function(next) {
  if (this._update.password) {
    this._update.password = await bcrypt.hash(
      this._update.password,
      8
    );
  }

  next();
});

UserSchema.methods = {
  compareHash(password) {
    return bcrypt.compare(password, this.password);
  }
};

UserSchema.statics = {
  generateToken({ id, name, email, admin }) {
    return jwt.encode(
      {
        id,
        name,
        email,
        admin,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 20 * 3
      },
      process.env.AUTH_SECRET
    );
  },
  decodeToken(token) {
    return jwt.decode(token, process.env.AUTH_SECRET);
  }
};

UserSchema.plugin(mongoosePaginate);

module.exports = model('user', UserSchema);
