const express = require("express");
const { getAllClubs, getClubById, createClub, updateClub, deleteClub } = require("../controllers/club.controller");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();

router.get("/", isAuthenticated,getAllClubs);  
router.get("/:id", isAuthenticated, getClubById);  
router.post("/", isAuthenticated, createClub);  
router.put("/:id", isAuthenticated, updateClub);  
router.delete("/:id", isAuthenticated, deleteClub);  



module.exports = router;
