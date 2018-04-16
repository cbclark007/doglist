const mongoose = require('mongoose');

const dogSchema = mongoose.Schema({
  name: {
    type:String,
    required:true,
    minLength:1,
    unique:true
  },
  age: {
    type:Number,
    required:true
  }
})

const Dog = mongoose.model('Dog', dogSchema);

module.exports = {Dog}
