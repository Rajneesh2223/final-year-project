const passport = require("passport");
const User = require("../model/Users"); // Fixed path (models instead of model)
const { ADMIN_WHITELIST, ROLES } = require("../constants")

// Google OAuth initiation
const googleAuth = passport.authenticate("google", { 
  scope: ["profile", "email"],
  prompt: "select_account"
});

// Google OAuth callback (with admin role assignment)
const googleCallback = (req, res, next) => {
  passport.authenticate('google', async (err, user, info) => {
    try {
      // Error handling
      if (err) {
        console.error('Auth error:', err);
        return res.redirect('/login?error=auth_failed');
      }
      if (!user) {
        console.error('No user:', info);
        return res.redirect('/login?error=no_user');
      }

      // Auto-assign admin role if email is whitelisted
      if (ADMIN_WHITELIST.includes(user.email)) {
        user.role = ROLES.ADMIN;
        await user.save();
      }

      // Login and session handling
      req.logIn(user, (err) => {
        if (err) {
          console.error('Session error:', err);
          return res.redirect('/login?error=session_error');
        }
        
        // Redirect based on role
        const redirectUrl = user.role === ROLES.ADMIN 
          ? 'http://localhost:3000/admin/dashboard' 
          : 'http://localhost:3000/dashboard';
        
        return res.redirect(redirectUrl);
      });

    } catch (error) {
      console.error('Callback error:', error);
      res.redirect('/login?error=server_error');
    }
  })(req, res, next);
};

// Get current user (with role info)
const getCurrentUser = (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  res.json({
    ...req.user.toObject(),
    isAdmin: req.user.role === ROLES.ADMIN // Explicit admin flag for frontend
  });
};

// Logout (with session cleanup)
const logout = (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) console.error('Session destruction error:', err);
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });
};


module.exports = {
  googleAuth,
  googleCallback,
  getCurrentUser,
  logout
};