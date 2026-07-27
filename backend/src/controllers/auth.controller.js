const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { successResponse, errorResponse } = require("../utils/response");

//generate JWT token
const generateToken = (id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRE,
  });
};

// @desc  Login user
// @route POST /api/auth/login


const login = async(req,res) =>{
  try{
    const{email,password} = req.body;
    //check fields
    if(!email || !password){
      return errorResponse(res,400,"Please provide email and password");
    }
    //find user
    const user = await User.findOne({email});
    if(!user){
      return errorResponse(res,401,"Invalid email or password");
    }
    // check password
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
      return errorResponse(res, 401, "Invalid email or password");
    }
    if (!user.isActive) {
      return errorResponse(res, 401, "Account is deactivated");
    }
    //generate token
    const token = generateToken(user._id);

    return successResponse(res, 200, "Login successful", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  }catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc  Get current logged in user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return successResponse(res, 200, "User fetched", user);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc  Create manager (admin only)
// @route POST /api/auth/create-manager
const createManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 400, "Please provide all fields");
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, "Email already exists");
    }

    // Create manager
    const manager = await User.create({
      name,
      email,
      password,
      role: "manager",
    });

    return successResponse(res, 201, "Manager created successfully", {
      id: manager._id,
      name: manager.name,
      email: manager.email,
      role: manager.role,
    });

  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { login, getMe, createManager };