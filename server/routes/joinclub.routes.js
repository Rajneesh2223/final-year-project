const express = require('express');
const router = express.Router();
const {joinClub , getClubMembers , getUserClubs} = require('../controllers/joinclub.controller');

// User joins a club
router.post('/clubs/:clubId/join', joinClub);

// Admin retrieves all members of a club
router.get('/clubs/:clubId/members', getClubMembers);

// Get all clubs joined by a user
router.get('/users/:userId/clubs', getUserClubs);

module.exports = router;
