const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true }, 
    date: { type: Date, required: true },
    location: { type: String, required: true },
    attendeesCount: { type: Number, default: 0 },
    status: { type: String, enum: ["Upcoming", "Completed", "Cancelled"], default: "Upcoming" },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    creatorName: { type: String, required: true },
    creatorRole: { type: String, enum: ["student", "faculty", "admin"], required: true },
    eventLink: { type: String }, 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
