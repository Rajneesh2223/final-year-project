const mongoose = require("mongoose");

const ClubSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    membersCount: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    description: { type: String, required: true },
    meetingSchedule: { type: String }, 
    location: { type: String }, 
    category: { type: String, required: true }, 
    upcomingEvents: [{ type: String }] ,
    isFeatured: { type: Boolean, default: false },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Club = mongoose.model("Club", ClubSchema);
module.exports = Club;
