
const express = require("express");
const { getAllTasks, createTask, deleteTask ,updateTask, getUserTasks, createUserTask, deleteUserTask, updateUserTask,removeAttachment} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const router = express.Router();

 router.get("/", getAllTasks);//make sure this exists 
 router.post("/", createTask);
 router.delete("/:id", deleteTask);
 router.put("/:id",updateTask);

 router.get("/user", authMiddleware,getUserTasks);
 router.post("/user", authMiddleware,createUserTask);
 router.delete("/user/:id", authMiddleware,deleteUserTask);
 router.put("/user/:id", authMiddleware,updateUserTask);
 router.delete("/remove-attachment/:taskId/:fileName",authMiddleware,removeAttachment);

 const storage = multer.diskStorage({
    destination : (req,file, cb)=> cb(null,"uploads/"),
    filename:(req,file,cb)=> cb(null,Date.now()+"-"+file.originalname),
 });

 const upload = multer({storage});
 router.post("/upload/:taskId", upload.single("attachment"), async (req, res) => {
    try {
      const task = await Task.findById(req.params.taskId);
      if (!task) return res.status(404).json({ message: "Task not found" });
  
      const filePath = `http://localhost:5000/uploads/${req.file.filename}`; // Generate file URL
  
      task.attachments.push(filePath); // Store full URL instead of just filename
      await task.save();
  
      res.json({ message: "File uploaded successfully", attachment: filePath });
    } catch (err) {
      res.status(500).json({ message: "Error uploading file", error: err.message });
    }
  });
 module.exports = router;