const mongoose = require('mongoose');

// const childSchema = new mongoose.Schema({ 
//   _id:{type:Number, required:true},
// });

const customerSchema = mongoose.Schema({
  _id:{type:Number, required:true},
  name: { type: String, required: true },
  fname: { type: String, required: true },
  mobNum:{ type:String,required:false},
  village:{ type:String,required:true},
  caste:{ type:String,required:true},
  transactions:[String]

});

module.exports = mongoose.model('Customer', customerSchema);
