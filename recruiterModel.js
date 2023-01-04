const mongoose =require("mongoose");

const recruiterSchema= mongoose.Schema({
  company:{
    type:String

  },
  username:{
    type:String

  },
  phoneno:{
    type: Number
  },
  password:{
    type:String

  },
  state:{
    type:String

  },
  city:{
    type:String

  },
  zip:{
    type:Number

  }



});



module.exports=mongoose.model("Recruiter", recruiterSchema);
