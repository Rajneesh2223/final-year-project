const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/Users');
const { ROLES } = require('../constants');

console.log('Checking Google OAuth credentials...');
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing Google OAuth credentials!');
  throw new Error('Missing Google OAuth credentials in environment variables');
}

passport.serializeUser((user, done) => {
  console.log('SERIALIZE USER:', user._id);
  done(null, user._id); 
});

passport.deserializeUser(async (id, done) => {
  console.log('DESERIALIZE USER ATTEMPT:', id);
  try {
    const user = await User.findById(id);
    if (!user) {
      console.error('USER NOT FOUND FOR ID:', id);
      return done(null, false);
    }
    console.log('SUCCESSFUL DESERIALIZATION FOR:', user.email);
    done(null, user);
  } catch (err) {
    console.error('DESERIALIZATION ERROR:', err);
    done(err, null);
  }
});

// List of admin emails
const adminEmails = ['rajneeshkumar6267@gmail.com' , "kg7460502@gmail.com"];

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback',
    scope: ['profile', 'email'],
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log('GOOGLE PROFILE RECEIVED:', profile.id);
    
    try {
      const email = profile.emails[0].value;
      console.log('VERIFYING EMAIL:', email);
      
      // Allow specific admin email or IET emails
      const isAdminEmail = adminEmails.includes(email);
      
      if (!isAdminEmail && !email.endsWith('@ietlucknow.ac.in')) {
        console.log('REJECTED UNAUTHORIZED EMAIL:', email);
        return done(new Error('Only authorized email addresses are allowed'));
      }
      
      console.log('SEARCHING FOR EXISTING USER...');
      let user = await User.findOne({ googleId: profile.id });

      // Determine role - admin for specified emails, user for others
      const role = isAdminEmail ? ROLES.ADMIN : ROLES.STUDENT;
      console.log(`ASSIGNING ROLE: ${role} for ${email}`);

      if (user) {
        console.log('EXISTING USER FOUND:', user.email);
        
        // Update role if needed
        if (user.role !== role) {
          user.role = role;
          console.log(`UPDATED ROLE TO ${role} FOR: ${email}`);
        }
        
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }

      console.log('CREATING NEW USER FOR:', email);
      
      // First, make sure your User model has a role field
      // If not, you'll need to update your User model to include this field
      user = await User.create({
        googleId: profile.id,
        email: email,
        name: profile.displayName,
        picture: profile.photos[0].value,
        role: role, // Set the determined role
        accessToken: accessToken,
        refreshToken: refreshToken,
        lastLogin: new Date()
      });

      console.log('NEW USER CREATED:', user.email, 'WITH ROLE:', role);
      done(null, user);
    } catch (err) {
      console.error('GOOGLE STRATEGY ERROR:', err);
      done(err, null);
    }
  }
));

console.log('Passport configuration complete!');
module.exports = passport;