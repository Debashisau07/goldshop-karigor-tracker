const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/role.middleware");

// Public routes
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/validate-invite/:token", validateInvite);
router.post("/register", registerManager);

// Protected routes
router.get("/me", protect, getMe);
router.post("/create-manager", protect, adminOnly, createManager);

// Admin only routes
router.post("/generate-invite", protect, adminOnly, generateInvite);
router.get("/managers", protect, adminOnly, getManagers);
router.patch(
  "/managers/:id/deactivate",
  protect,
  adminOnly,
  deactivateManager
);

module.exports = router;