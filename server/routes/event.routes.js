const express = require("express");
const { createEvent, getAllEvents, getEventsByClub, updateEvent, getEventById, getUpcomingEventsByClub } = require("../controllers/event.controller");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();

router.post("/", isAuthenticated, createEvent); 
router.get("/",  isAuthenticated, getAllEvents); 
router.get("/:eventId",  isAuthenticated, getEventById); // Get a single event by ID
router.get("/club/:clubId",  isAuthenticated, getEventsByClub); // Get events by club ID
router.put("/:eventId",  isAuthenticated, updateEvent); // Update an event
router.get("/upcoming/:clubId",  isAuthenticated, getUpcomingEventsByClub);

module.exports = router;    
