const mongoose = require('mongoose');

const accountsSchema = mongoose.Schema({
  _id:{type:Number, required:true},
  userName: { type: String, required: true },
  password: { type: String, required: true },
  type:{ type:String,required:true},


});

module.exports = mongoose.model('Accounts', accountsSchema);
