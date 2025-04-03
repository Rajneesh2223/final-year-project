const passport = require("passport");
const User = require("../model/Users");
const mongoose = require("mongoose");

const googleAuth = passport.authenticate("google", { 
  scope: ["profile", "email"],
  prompt: "select_account"
});


const googleCallback = (req, res, next) => {
  console.log('GOOGLE CALLBACK INITIATED');
  passport.authenticate('google', (err, user, info) => {
    console.log('AUTHENTICATE CALLBACK FIRED');
    if (err) {
      console.error('AUTH ERROR:', err);
      return res.redirect('/login?error=auth_failed');
    }
    if (!user) {
      console.error('NO USER:', info);
      return res.redirect('/login?error=no_user');
    }

    req.logIn(user, async (err) => {
      if (err) {
        console.error('LOGIN ERROR:', err);
        return res.redirect('/login?error=session_error');
      }

      console.log('SUCCESSFUL LOGIN FOR:', user.email);
      console.log('SESSION BEFORE SAVE:', req.session);
      
      // Force session save
      req.session.save((err) => {
        if (err) console.error('SESSION SAVE ERROR:', err);
        console.log('SESSION AFTER SAVE:', req.session);
        res.redirect('http://localhost:3000/dashboard');
      });
    });
  })(req, res, next);
};
const getCurrentUser = (req, res) => {
  console.log("Session Data:", req.session);
  console.log("User Data:", req.user);

  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json(req.user);

};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out", error: err.message });
    }
    res.clearCookie('connect.sid');
    res.json({ message: "Logged out successfully" });
  });
};

const updateUser = async (req, res) => {
  try {
    const { name, email, picture, role, bio, department, year, contact, socialLinks } = req.body;
    const userId = req.user._id; 

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Convert userId to ObjectId (if necessary)
    const objectId = new mongoose.Types.ObjectId(userId);

    const updatedUser = await User.findByIdAndUpdate(
      objectId,
      { name, email, picture, role, bio, department, year, contact, socialLinks },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};
module.exports = { updateUser };


module.exports = {
  googleAuth,
  googleCallback,
  getCurrentUser,
  logout,
  updateUser
}; 