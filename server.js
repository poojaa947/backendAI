
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
  
const taskRoutes = require("./routes/taskRoutes");//import routes 
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use("/uploads",express.static("uploads"));

//middleware
app.use(express.json());
app.use(cors());
app.use(cors({crendentials:true,origin:"http://localhost:3000"}));

//mangodb connection 
const MONGO_URI ="mongodb://localhost:27017/tasksDb";

mongoose.connect(MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log("MongoDB Connected"))
.catch(err=> console.error("MongoDB Connection Error:",err));


app.use("/api/tasks",taskRoutes);
app.use("/api/auth",authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Server running on port ${PORT}`));