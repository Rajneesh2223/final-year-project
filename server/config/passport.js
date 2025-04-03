

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/Users');

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
      
      if (!email.endsWith('@ietlucknow.ac.in')) {
        console.log('REJECTED NON-IET EMAIL:', email);
        return done(new Error('Only IET Lucknow email addresses are allowed'));
      }
      
      console.log('SEARCHING FOR EXISTING USER...');
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        console.log('EXISTING USER FOUND:', user.email);
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }

      console.log('CREATING NEW USER FOR:', email);
      user = await User.create({
        googleId: profile.id,
        email: email,
        name: profile.displayName,
        picture: profile.photos[0].value,
        accessToken: accessToken,
        refreshToken: refreshToken,
        lastLogin: new Date()
      });

      console.log('NEW USER CREATED:', user.email);
      done(null, user);
    } catch (err) {
      console.error('GOOGLE STRATEGY ERROR:', err);
      done(err, null);
    }
  }
));

console.log('Passport configuration complete!');
module.exports = passport;