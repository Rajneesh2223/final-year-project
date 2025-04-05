const express = require("express");
const router = express.Router();
const { googleAuth, googleCallback, logout, getCurrentUser } = require("../controllers/authController");
const { isAuthenticated } = require("../middleware/auth");

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// Get Current User
router.get("/current-user", isAuthenticated, getCurrentUser);


// Logout
router.post("/logout", logout);

module.exports = router; 
