const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { username,email,password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "email already in use"});

    const newUser = new User({ username,email,password });
    await newUser.save();

    res.status(201).json({message: "user registered successfully" });
 }  catch (error) {
    res.status(500).json({ message: error.message });
 }
};


exports.login = async (req,res) => {
    try {
      const {email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "invalid email or password" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "invalid email or password" });
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,{ expiresIn: "1h" });
      console.log("generated token",token);

      res.json({
        message:"login successfull",
        token,
        userId:user._id
      });console.log("user found in db",req.user);

    }catch (error) {
     res.status(500).json({ message: error.message });
    }
};

exports.verifyUser = async (req,res) => {
  try{
    res.json({ success: true,message:"user verified"});

  }catch (error){
    res.status(500).json({message: "verification failed"});
  }
};