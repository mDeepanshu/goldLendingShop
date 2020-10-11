const mongoose = require('mongoose');

const debitCreditSchema = mongoose.Schema({
  _id:{type:Number, required:true},
  date:{type:String, required:true},
  amount:{ type:Number,required:false},
  description:{ type:String}

});

module.exports = mongoose.model('debitCredit', debitCreditSchema);
