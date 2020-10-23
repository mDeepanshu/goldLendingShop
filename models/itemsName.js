const mongoose = require('mongoose');


const itemNameSchema = mongoose.Schema({
  _id:{type:Number, required:true},
  itemsName:[String]

});

module.exports = mongoose.model('itemName', itemNameSchema);
