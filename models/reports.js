const mongoose = require('mongoose');


const reportSchema = mongoose.Schema({
  _id:{type:Number, required:true},
  transactions:[Number]

});

module.exports = mongoose.model('Report', reportSchema);
