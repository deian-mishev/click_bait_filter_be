const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
  },
}));

module.exports = User;