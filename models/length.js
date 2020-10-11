const mongoose = require('mongoose');

const lengthSchema = mongoose.Schema({
  _id:{type:Number,required: true},
  length: { type: Number, required: true },
  name: { type: String, required: true },
  date: { type: String }



});

module.exports = mongoose.model('Length', lengthSchema);
