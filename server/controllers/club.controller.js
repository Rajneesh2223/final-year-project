const Club = require("../model/club.model");

// Fetch all clubs
const getAllClubs = async (req, res) => {
    try {
        const clubs = await Club.find();
        res.status(200).json(clubs);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get a single club by ID
const getClubById = async (req, res) => {
    try {
        
        const { id } = req.params;
        const club = await Club.findById(id);
        
        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }
        
        res.status(200).json(club);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Create a new club
const createClub = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            meetingSchedule,
            location,
            upcomingEvents,
            isFeatured,
            image
        } = req.body;

        // Validate required fields
        if (!name || !description || !category) {
            return res.status(400).json({
                message: "Missing required fields. Please provide name, description, and category."
            });
        }

        // Check if club with same name already exists
        const existingClub = await Club.findOne({ name });
        if (existingClub) {
            return res.status(400).json({
                message: "A club with this name already exists."
            });
        }

        const club = new Club({
            name,
            description,
            category,
            meetingSchedule,
            location,
            upcomingEvents: upcomingEvents || [],
            isFeatured: isFeatured || false,
            image,
            membersCount: 0,
            status: "Active"
        });

        await club.save();
        res.status(201).json(club);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update a club
const updateClub = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            category,
            meetingSchedule,
            location,
            upcomingEvents,
            isFeatured,
            image,
            status
        } = req.body;

        // Check if club exists
        const club = await Club.findById(id);
        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }

        // If name is being updated, check for duplicates
        if (name && name !== club.name) {
            const existingClub = await Club.findOne({ name });
            if (existingClub) {
                return res.status(400).json({
                    message: "A club with this name already exists."
                });
            }
        }

        // Update fields
        const updatedClub = await Club.findByIdAndUpdate(
            id,
            {
                name,
                description,
                category,
                meetingSchedule,
                location,
                upcomingEvents,
                isFeatured,
                image,
                status
            },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedClub);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete a club
const deleteClub = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if club exists
        const club = await Club.findById(id);
        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }

        await Club.findByIdAndDelete(id);
        res.status(200).json({ message: "Club deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { getAllClubs, getClubById, createClub, updateClub, deleteClub };
