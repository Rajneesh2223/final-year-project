const express = require("express");
const { getAllClubs, getClubById, createClub, updateClub, deleteClub } = require("../controllers/club.controller");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();

router.get("/", isAuthenticated,getAllClubs);  // Fetch all clubs
router.get("/:id", isAuthenticated, getClubById);  // Get a single club by ID
router.post("/", isAuthenticated, createClub);  // Create a new club
router.put("/:id", isAuthenticated, updateClub);  // Update a club
router.delete("/:id", isAuthenticated, deleteClub);  // Delete a club

module.exports = router;
