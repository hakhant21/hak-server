const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Your name cannot be empty'],
    },
    email: {
      type: String,
      required: [true, 'Email has to be valid email and cannot be empty'],
    },
    password: {
      type: String,
      required: [true, 'Password must be at least 8 characters'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
