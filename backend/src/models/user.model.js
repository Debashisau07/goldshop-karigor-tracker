/*Defines the structure of a User
in our database

Like designing a form:
what fields does a user have?
what are the rules for each field?*/

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Name is required"],
    trim:true,
  },
  email:{
    type:String,
    required:[true,"Email is required"],
    unique:true,
    lowercase:true,
    trim:true,
  },
  password:{
    type:String,
    required:[true,"Password is required"],
    minLength:6,
  },
  role:{
    type:String,
    enum:["admin","manager"],
    default:"manager",
  },
  isActive:{
    type:Boolean,
    default:true,
  },
},{timestamps:true});

// Hash the password before saving the user
userSchema.pre("save",async function(next) {
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10);
  next();
})

// compare password method
userSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password);
}

module.exports = mongoose.model("User",userSchema);