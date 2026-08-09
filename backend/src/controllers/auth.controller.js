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
// @desc  Generate invite link (admin only)
// @route POST /api/auth/generate-invite
const generateInvite = async (req, res) => {
  try {
    const crypto = require("crypto");
    const bcrypt = require("bcryptjs");

    // Generate random token
    const inviteToken = crypto.randomBytes(32).toString("hex");

    // Expires in 7 days
    const inviteTokenExpiry = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    // Hash a dummy password manually
    // to avoid pre save hook issue
    const salt = await bcrypt.genSalt(10);
    const dummyPassword = await bcrypt.hash(
      crypto.randomBytes(16).toString("hex"),
      salt
    );

    // Insert directly to DB bypassing pre save hook
    await User.collection.insertOne({
      name: "pending",
      email: `invite_${inviteToken}@pending.com`,
      password: dummyPassword,
      role: "manager",
      isActive: false,
      inviteToken,
      inviteTokenExpiry,
      resetOTP: null,
      resetOTPExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const inviteLink = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/register?token=${inviteToken}`;

    return successResponse(res, 201, "Invite link generated", {
      inviteLink,
      expiresIn: "7 days",
    });
  } catch (error) {
    console.error("Generate invite error:", error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc  Validate invite token
// @route GET /api/auth/validate-invite/:token
const validateInvite = async (req, res) => {
  try {
    const { token } = req.params;

    const invite = await User.findOne({
      inviteToken: token,
      isActive: false,
      name: "pending",
    });

    if (!invite) {
      return errorResponse(res, 400, "Invalid invite link");
    }

    if (new Date() > new Date(invite.inviteTokenExpiry)) {
      await User.findByIdAndDelete(invite._id);
      return errorResponse(
        res,
        400,
        "Invite link has expired. Please request a new one."
      );
    }

    return successResponse(res, 200, "Valid invite link", {
      valid: true,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc  Register manager via invite
// @route POST /api/auth/register
const registerManager = async (req, res) => {
  try {
    const { name, email, password, token } = req.body;

    if (!name || !email || !password || !token) {
      return errorResponse(res, 400, "Please provide all fields");
    }

    if (password.length < 6) {
      return errorResponse(
        res,
        400,
        "Password must be at least 6 characters"
      );
    }

    // Find invite
    const invite = await User.findOne({
      inviteToken: token,
      isActive: false,
      name: "pending",
    });

    if (!invite) {
      return errorResponse(res, 400, "Invalid invite link");
    }

    if (new Date() > new Date(invite.inviteTokenExpiry)) {
      await User.findByIdAndDelete(invite._id);
      return errorResponse(
        res,
        400,
        "Invite link has expired. Please request a new one."
      );
    }

    // Check email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, "Email already registered");
    }

    // Hash password
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the pending invite record to real manager
    const manager = await User.findByIdAndUpdate(
      invite._id,
      {
        name,
        email,
        password: hashedPassword,
        role: "manager",
        isActive: true,
        inviteToken: null,
        inviteTokenExpiry: null,
      },
      { new: true }
    );

    // Generate token
    const jwtToken = generateToken(manager._id);

    return successResponse(res, 201, "Account created successfully", {
      token: jwtToken,
      user: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        role: manager.role,
      },
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc  Get all managers (admin only)
// @route GET /api/auth/managers
const getManagers = async (req, res) => {
  try {
    const managers = await User.find({
      role: "manager",
      name: { $ne: "pending" },
    }).select("-password -resetOTP -resetOTPExpiry -inviteToken -inviteTokenExpiry");

    return successResponse(res, 200, "Managers fetched", managers);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc  Deactivate manager (admin only)
// @route PATCH /api/auth/managers/:id/deactivate
const deactivateManager = async (req, res) => {
  try {
    const manager = await User.findById(req.params.id);

    if (!manager) {
      return errorResponse(res, 404, "Manager not found");
    }

    if (manager.role === "admin") {
      return errorResponse(res, 400, "Cannot deactivate admin");
    }

    await User.findByIdAndUpdate(req.params.id, {
      isActive: !manager.isActive,
    });

    return successResponse(
      res,
      200,
      `Manager ${manager.isActive ? "deactivated" : "activated"} successfully`
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  login,
  getMe,
  createManager,
  forgotPassword,
  resetPassword,
  generateInvite,
  validateInvite,
  registerManager,
  getManagers,
  deactivateManager,
};
