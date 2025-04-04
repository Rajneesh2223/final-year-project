const express = require('express');
const router = express.Router();
const {registerForEvent , getUserEvents , getEventRegistrations} = require('../controllers/registrationController.js');

// Register a user for an event
router.post('/events/:eventId/register',registerForEvent);

// Get events registered by a user
router.get('/users/:userId/events',getUserEvents);

// Get users registered for an event
router.get('/events/:eventId/registrations',getEventRegistrations);

module.exports = router;
