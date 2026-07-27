const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const {errorResponse} = require('../utils/response');

const protect = async (req,res,next)=>{
  try{
    // check if the token is present in the header
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
      return errorResponse(res, 401,"Not authorized. No token.");
    }

    // extract the token
    const token = authHeader.split(" ")[1];

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return errorResponse(res, 401, "User not found");
    }

    if (!user.isActive) {
      return errorResponse(res, 401, "Account is deactivated");
    }

    req.user = user;
    next();
  }catch(err){
    return errorResponse(res, 401,"Token invalid or expired");
  }
};
module.exports = {protect};