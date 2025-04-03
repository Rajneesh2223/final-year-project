const express = require("express");
const router = express.Router();
const { googleAuth, googleCallback, logout, getCurrentUser, updateUser } = require("../controllers/authController");
const { isAuthenticated } = require("../middleware/auth");

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// Get Current User
router.get("/current-user", isAuthenticated, getCurrentUser);
router.put("/update-user", isAuthenticated, updateUser);

// Logout
router.post("/logout", logout);

module.exports = router; 
