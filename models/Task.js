
const mongoose = require("mongoose");

//define task schema 
const TaskSchema = new mongoose.Schema({

   title: {type: String, required: true },//task title(required)
   completed: {  type: Boolean, default: false },//completion status (defaults to false)
   status:{
       type:String,
       enum:["not started","in progress","pending","completed"],
       default:"not stated",
   },
   user: { type: mongoose.Schema.Types.ObjectId,ref: "User",required:true },
   attachments:[{ type: String }]
});

module.exports = mongoose.model("Task", TaskSchema);//creates "tasks" collection