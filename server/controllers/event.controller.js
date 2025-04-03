const Event = require("../model/event.model");
const Club = require("../model/club.model");

// Create an Event
const createEvent = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            clubId, 
            date, 
            location, 
            attendeesCount, 
            status,
            creatorId,
            creatorName,
            creatorRole,
            eventLink 
        } = req.body;

        // Validate required fields
        if (!name || !description || !clubId || !date || !location || !creatorId || !creatorName || !creatorRole) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Validate status
        const validStatuses = ["Upcoming", "Completed", "Cancelled"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        // Validate creator role
        const validRoles = ["student", "faculty", "admin"];
        if (!validRoles.includes(creatorRole)) {
            return res.status(400).json({ message: "Invalid creator role." });
        }

        // Validate event link if provided
        if (eventLink) {
            try {
                new URL(eventLink);
            } catch (error) {
                return res.status(400).json({ message: "Invalid event link URL format." });
            }
        }

        // Check if club exists
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: "Club not found." });
        }

        const event = new Event({
            name,
            description,
            clubId,
            date,
            location,
            attendeesCount: attendeesCount || 0,
            status: status || "Upcoming",
            creatorId,
            creatorName,
            creatorRole,
            eventLink
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get all events
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("clubId", "name category");
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get events by Club ID
const getEventsByClub = async (req, res) => {
    try {
        const { clubId } = req.params;
        const events = await Event.find({ clubId }).populate("clubId", "name");
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update an Event
const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const updateData = req.body;

        // Validate status if provided
        if (updateData.status) {
            const validStatuses = ["Upcoming", "Completed", "Cancelled"];
            if (!validStatuses.includes(updateData.status)) {
                return res.status(400).json({ message: "Invalid status value." });
            }
        }

        // Validate creator role if provided
        if (updateData.creatorRole) {
            const validRoles = ["student", "faculty", "admin"];
            if (!validRoles.includes(updateData.creatorRole)) {
                return res.status(400).json({ message: "Invalid creator role." });
            }
        }

        // Validate event link if provided
        if (updateData.eventLink) {
            try {
                new URL(updateData.eventLink);
            } catch (error) {
                return res.status(400).json({ message: "Invalid event link URL format." });
            }
        }

        // Check if club exists if clubId is being updated
        if (updateData.clubId) {
            const club = await Club.findById(updateData.clubId);
            if (!club) {
                return res.status(404).json({ message: "Club not found." });
            }
        }

        const event = await Event.findByIdAndUpdate(
            eventId,
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get a single event by ID
const getEventById = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId).populate("clubId", "name category");
        
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


const getUpcomingEventsByClub = async (req, res) => {
    try {
        const { clubId } = req.params;

        // Validate club existence
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: "Club not found." });
        }

        // Fetch only upcoming events for the given club
        const upcomingEvents = await Event.find({ clubId, status: "Upcoming" })
            .populate("clubId", "name category")
            .sort({ date: 1 }); // Sort by date (earliest first)

        res.status(200).json(upcomingEvents);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};




module.exports = {
    createEvent,
    getAllEvents,
    getEventsByClub,
    updateEvent,
    getEventById,
    getUpcomingEventsByClub
};
