const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
  _id:{type:Number, required:true},
  date:{type:String, required:true},
  T:{ type:String,required:true},
  main_bal:{ type:Number},
  approved:{type:Boolean}

});

module.exports = mongoose.model('orders', ordersSchema);
