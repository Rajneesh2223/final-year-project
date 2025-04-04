const Event = require('../model/event.model');
const User = require('../model/Users');
const mongoose = require('mongoose');

// Register a user for an event
async function registerForEvent(req, res) {
  const { eventId } = req.params;
  const { userId } = req.body;
  console.log("event Id " , eventId , "userId " , userId);

  try {
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid event or user ID' });
    }

    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user || !event) {
      return res.status(404).json({ message: 'User or Event not found' });
    }

    if (user.registeredEvents.includes(eventId)) {
      return res.status(400).json({ message: 'User already registered for this event' });
    }

    // Use transaction for atomicity
    const session = await mongoose.startSession();
    session.startTransaction();

    user.registeredEvents.push(eventId);
    event.registeredUsers.push(userId);

    await user.save({ session });
    await event.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error('Error registering for event:', error); // Log the error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Retrieve events registered by a user
async function getUserEvents(req, res) {
  const { userId } = req.params;

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId).populate('registeredEvents');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.registeredEvents);
  } catch (error) {
    console.error('Error getting user events:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Retrieve users registered for an event
async function getEventRegistrations(req, res) {
  const { eventId } = req.params;

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(eventId).populate('registeredUsers');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event.registeredUsers);
  } catch (error) {
    console.error('Error getting event registrations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = {
  registerForEvent,
  getUserEvents,
  getEventRegistrations,
};