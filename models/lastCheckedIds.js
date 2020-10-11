const mongoose = require('mongoose');

const lastCheckedIdsSchema = mongoose.Schema({
  _id: { type: String, required: true },
  Id: { type: Number, required: true },
  name: { type: String, required: true }



});

module.exports = mongoose.model('LastCheckedIds', lastCheckedIdsSchema);
