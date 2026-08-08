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

// @desc  Forgot password - send OTP
// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    console.log("Step 1 - Request received:", req.body);

    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 400, "Please provide email");
    }

    console.log("Step 2 - Finding user:", email);

    const user = await User.findOne({ email });

    console.log("Step 3 - User found:", user ? "yes" : "no");

    if (!user) {
      return successResponse(
        res,
        200,
        "If this email exists, OTP has been sent"
      );
    }

    console.log("Step 4 - Generating OTP");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    console.log("Step 5 - Saving OTP to DB");

    await User.findByIdAndUpdate(user._id, {
      resetOTP: otp,
      resetOTPExpiry: expiry,
    });

    console.log("Step 6 - Sending email");

    const sendEmail = require("../config/email");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#F59E0B,#D97706);padding:30px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:24px">
            Gold Karigor Tracker
          </h1>
          <p style="color:#FEF3C7;margin:8px 0 0">
            Password Reset OTP
          </p>
        </div>
        <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;border-top:none">
          <p style="color:#374151;font-size:16px">
            Hello <strong>${user.name}</strong>,
          </p>
          <p style="color:#6B7280">
            You requested to reset your password.
            Use the OTP below:
          </p>
          <div style="background:#FEF3C7;border:2px dashed #F59E0B;border-radius:12px;padding:20px;text-align:center;margin:20px 0">
            <p style="margin:0;font-size:14px;color:#92400E;font-weight:600">
              Your OTP
            </p>
            <p style="margin:8px 0 0;font-size:42px;font-weight:bold;color:#D97706;letter-spacing:8px">
              ${otp}
            </p>
          </div>
          <p style="color:#EF4444;font-size:13px;text-align:center">
            This OTP expires in <strong>10 minutes</strong>
          </p>
          <p style="color:#6B7280;font-size:13px">
            If you did not request this please ignore this email.
          </p>
        </div>
        <div style="background:#F9FAFB;padding:15px;text-align:center;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
          <p style="margin:0;color:#9CA3AF;font-size:12px">
            Gold Karigor Tracker — Secure Password Reset
          </p>
        </div>
      </div>
    `;

    await sendEmail(
      email,
      "Password Reset OTP - Gold Karigor Tracker",
      html
    );

    console.log("Step 7 - Email sent successfully");

    return successResponse(
      res,
      200,
      "If this email exists, OTP has been sent"
    );

  } catch (error) {
    console.error("Forgot password error details:", error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc  Reset password with OTP
// @route POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return errorResponse(res, 400, "Please provide all fields");
    }

    if (newPassword.length < 6) {
      return errorResponse(
        res,
        400,
        "Password must be at least 6 characters"
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 400, "Invalid request");
    }

    // Check OTP exists
    if (!user.resetOTP || !user.resetOTPExpiry) {
      return errorResponse(
        res,
        400,
        "No OTP requested. Please request a new one."
      );
    }

    // Check OTP expiry
    if (new Date() > new Date(user.resetOTPExpiry)) {
      await User.findByIdAndUpdate(user._id, {
        resetOTP: null,
        resetOTPExpiry: null,
      });
      return errorResponse(
        res,
        400,
        "OTP has expired. Please request a new one."
      );
    }

    // Check OTP match
    if (user.resetOTP !== otp) {
      return errorResponse(res, 400, "Invalid OTP. Please try again.");
    }

    // Hash new password manually
    // Bypassing pre save hook completely
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear OTP directly
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetOTP: null,
      resetOTPExpiry: null,
    });

    return successResponse(
      res,
      200,
      "Password reset successfully. Please login with your new password."
    );

  } catch (error) {
    console.error("Reset password error:", error);
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  login,
  getMe,
  createManager,
  forgotPassword,
  resetPassword,
};
