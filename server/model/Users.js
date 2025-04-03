const mongoose = require("mongoose");

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
      match: [/@ietlucknow.ac.in$/, "Only IET Lucknow email addresses are allowed"],
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
      enum: ["student", "faculty", "admin"],
      default: "student",
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
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  console.log("Saving user:", this.email);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;