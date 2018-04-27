const mongoose = require('mongoose');

const dogSchema = mongoose.Schema({
  name: {
    type:String,
    required:true,
    minLength:1
    // unique:true
  },
  age: {
    type:Number,
    required:true
  },
  description: {
    type:String,
    required:true,
    minLength:1
  },
  personality: {
    type:String,
    required:true
  },
  image: {
    type:String,
    required:true
  }
})

const Dog = mongoose.model('Dog', dogSchema);

module.exports = {Dog}
