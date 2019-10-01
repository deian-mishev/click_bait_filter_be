const mongoose = require('mongoose');
const Link = require('./link');

const websaitSchema = new mongoose.Schema({
  links: {
    type: Array, // Need to add of type Link
    unique: false,
  },
});

websaitSchema.static.findByPageName = async function (page) {
  let websait = await this.findOne({ page });

  if (!websait) {
    var hostname;
    if (url.indexOf("//") > -1) {
      hostname = url.split("/")[2];
    } else {
      hostname = url.split("/")[0];
    }
    hostname = hostname.split(":")[0];
    hostname = hostname.split("?")[0];
    websait = await this.findOne({
      page: hostname
    })
  }

  return websait;
};

const Websait = mongoose.model('Websait', websaitSchema);

module.exports = Websait;