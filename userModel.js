const mongoose =require("mongoose");


const userSchema=mongoose.Schema({
  name:{
    type:String,
    required: [true, 'Enter a name']
  },
  username:{
    type:String,
    required: [true, 'Enter a username']
  },
  phoneNo:{
    type: Number
  },
  password:{
    type:String,
    required:[true,'Cannot be empty']
  },
  skills:{
    type:String,
  },
  select:{
    type:String,
  },

  dob: {
    type: Date,
    default: Date.now
},

source : { data: Buffer, contentType: String }
});

module.exports=mongoose.model("User",userSchema);
