const mongoose = require('mongoose');

const Link = mongoose.model('Link', new mongoose.Schema({}));

module.exports = Link;