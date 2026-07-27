const express = require("express");
const router = express.Router();
const {
  login,
  getMe,
  createManager,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/role.middleware");

// Public routes
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.post("/create-manager", protect, adminOnly, createManager);

module.exports = router;