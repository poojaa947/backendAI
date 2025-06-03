
//import the task model to interact with the mangodb database 
const Task = require("../models/Task");

//this function retrives all the tasks from the database and returns them as a json response 
//if an error occurs it sends a 500 status code with an error message 

exports.getAllTasks =async (req,res)=> {
    try {
        const tasks =await Task.find();
        res.json(tasks);
    } catch (error){
        res.status(500).json({message: error.message });
    }
};

//this fn creates a new task using the title  provided in the request body.
//the task is then saved in the database and returned as a response 
//if an error occurs it sends a 500 status code with an error message .
exports.createTask =async (req,res) => {
    try {
        const newTask  = new Task({ title: req.body.title });
        await newTask.save();
        res.json(newTask);
    }
    catch (error) {
        res.status(500).json({message: error.message });
    }
};

//this function deletes a task from the database based on the provided task id
//if the task is successfully deleted ,a confirmation message is returned 
//if an errer occurs ,it sends a 500 status code with an error message 
exports .deleteTask = async (req,res) =>{
    try{
        await Task.findByIdAndDelete(req.params.id);
        res.json({message: "task deleted"});
    }catch (error) {
        res.status(500).json({ message: error.message});
    }
};


exports .updateTask= async (req, res) =>{
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        if (!updatedTask) {
            return res.status(404).json({message:"task not found"});

        }
        res.json(updatedTask);
    }   catch (error) {
        res.status(500).json({ message: error.message});
    }
};

exports.getUserTasks = async(req,res) => {
    try{
        console.log("request headers:",req.headers);
        console.log("extracted user:",req.user);
        if(!req.user || !req.user._id){
            return res.status(401).json({message:"unauthorised: user ID missing"});
    }
        const userId = req.user._id;
        console.log("fetching tasks for user ID:",userId);
        const {page=1,limit =5,search =""}=req.query;
        const query= {user:userId,title:{$regex:search,$options:"i"}};

        const tasks = await Task.find(query)
        .sort({createdAt:1})
        .skip((page -1)*limit)
        .limit(Number(limit));
        console.log("task found",tasks.length);
        res.status(200).json({
            tasks,
            total:await Task.countDocuments(query),
            page:Number(page),
            pages:Math.ceil((await Task.countDocuments(query))/limit),
        });

    }catch(error) {
        console.error("error fetching task:",error);
        res.status(500).json({message:"error fetching user-specific tasks "});


    }
};

exports.createUserTask = async (req,res) => {
    try{
        const {title,status} = req.body;
         
        if(!title){
            return res.status(400).json({message:"task tittle is required "});
        }
        
        const newTask = new Task({
            title,
            status:status || "not started",
            user:req.user.id,//
        });
        await newTask.save();
        res.status(201).json({message: "task created successfully",task: newTask});
    }catch(error){
        res.status(500).json({message:"error creating task ",error: error.message });
    }

   
};

exports.deleteUserTask= async(req,res)=>{
    try{
        const task=await Task.findOneAndDelete({_id:req.params.id,user: req.user.id});
        if(!task){
            return res.status(404).json({messgae:"task not found or unauthorized"});

        }
        res.json({message:"user-specific task deletd"});

    }catch(error) {
        res.status(500).json({message:"error deleting user-specific task "});

    }
};

exports.updateUserTask = async(req,res)=>{
try{
    const updatedTask = await Task.findOneAndUpdate(
        {_id: req.params.id,user:req.user.id},
        req.body,
        {new:true}
    );
    if(!updatedTask){
            return res.status(500).json({message:"task not found or authorized"});
    }
    res.json(updatedTask);
 }catch(error){
    res.status(500).json({message:"error updating user specific task"});
 }
};

exports.removeAttachment = async (req, res) => {
    try {
      console.log("Incoming request to remove attachment:", req.params);
  
      const { taskId, fileName } = req.params;
      if (!taskId || !fileName) return res.status(400).json({ message: "Missing taskId or fileName" });
  
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ message: "Task not found" });
  
      // Remove the attachment from the array
      task.attachments = task.attachments.filter(file => !file.includes(fileName));
  
      await task.save();
      res.json({ message: "Attachment removed successfully", updatedTask: task });
    } catch (error) {
      console.error("Error removing attachment:", error);
      res.status(500).json({ message: "Server error" });
    }
  };