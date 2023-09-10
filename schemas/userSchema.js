const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name field is required'],
  },
  email: {
    type: String,
    required: [true, 'email field is required'],
    unique: [true, 'Email is unique'],
  },
  password: {
    type: String,
    required: [true, 'password field is required'],
  },
  avatar: {
    type: String,
    required: [true, 'avatar field is required'],
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  },
});

module.exports = mongoose.model('User', UserSchema);
