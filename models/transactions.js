const mongoose = require('mongoose');

const transactionsSchema = mongoose.Schema({
  _id:{type:Number, required:true},
  itemName: { type: String, required: true },
  weight: { type: Number, required: true },
  principle:{ type:Number,required:true},
  roi:{ type:Number,required:true},
  issueDate:{ type:String,required:true},
  cusId:{ type:Number,required:true},
  returnDate:{type:String},
  profit:{type:Number},
  rid:{type:String},
  returned:{type:Boolean}



});

module.exports = mongoose.model('Transactions', transactionsSchema);
