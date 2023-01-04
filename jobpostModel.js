const mongoose=require("mongoose");

const jobpostSchema=mongoose.Schema({
  company:String,
  post:String,
  qualification:String,
  skill:String,
  city:String
});

module.exports=mongoose.model("Jobpost",jobpostSchema);
