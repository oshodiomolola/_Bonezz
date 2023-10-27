const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const validator = require('validator');

const schema = mongoose.Schema

const userSchema = new schema ({
  _id: {
    type: String,
    default: shortid.generate,
    autoIncrement: true,
    required: true,
    unique: true
  },
firstname: {
  type: String,
  required: [true, 'Firstname is required'],
  trim: true
},
lastname: {
  type: String,
  requires: [true, 'Lastname is required'],
  trim: true
},
email: {
  type: String,
  required: [true, 'Please provide your email'],
  unique: true,
  lowercase: true,
  validate: [validator.isEmail, 'Please provide a valid email'],
  trim: true
},
password: {
  type: String,
  required: true,
  minlength: 8,
  unique: true,
  trim: true
},
passwordConfirm: {
  type: String,
  required: true,
  trim: true
},
photo: {
  type: String
}
})

userSchema.pre('save', async function (next) {
if (!this.isModified('password')) {
  return next();
}
const hash = await bcrypt.hash(this.password, 12);
this.password = hash;
this.passwordConfirm = undefined;
next();
})

userSchema.methods.checkValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema)
module.exports = { User }