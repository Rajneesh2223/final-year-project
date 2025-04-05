const mongoose = require("mongoose");
const { ROLES } = require("../constants");

// IMPORTANT: Add this line to define adminEmails
const adminEmails = ['rajneeshkumar6267@gmail.com' , "kg7460502@gmail.com"];

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(email) {
          return adminEmails.includes(email) || email.endsWith('@ietlucknow.ac.in');
        },
        message: props => 'Only authorized email addresses are allowed'
      }
    },
    
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: [ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN],
      default: function() {
        // Set role based on email
        if (adminEmails.includes(this.email)) {
          return ROLES.ADMIN;
        }
        return ROLES.STUDENT; // Default role
      }
    },
    bio: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "",
    },
    year: {
      type: Number,
      default: 1,
    },
    contact: {
      type: String,
      default: "",
    },
    socialLinks: {
      github: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
    },
    registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    joinedClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
  },  
  { timestamps: true }
);
  
userSchema.pre("save", function (next) {
  console.log("Saving user:", this.email);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;