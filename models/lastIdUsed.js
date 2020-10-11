const mongoose = require('mongoose');

const lastidusedsSchema = mongoose.Schema({
  _id: { type: Number, required: true },
  ID: { type: Number, required: true },
  date: { type: String}



});

module.exports = mongoose.model('Lastiduseds', lastidusedsSchema);
