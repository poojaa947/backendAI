const jwt = require("jsonwebtoken");
const User = require("../models/User");


const authMiddleware = async (req,resizeBy,next) =>{
    const token = req.header("authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).json({message:"access denied.no token provided "})

    } 
try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    console.log("decoded token:",decoded);
    req.user = await User.findById(decoded.userId).select("password");
    console.log("authenticated user:",req.user);

    if(!req.user) {
        return res.status(401).json({message :"user not found "});
    }
    next();

}catch(error){
    res.status(401).json({message:"unauthorized: invalid token"});
}
};
module.exports=authMiddleware;