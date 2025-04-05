const express = require("express");
const connectDB = require("./db");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session"); 
const cors = require("cors");
const MongoStore = require('connect-mongo');

// Load environment variables first
dotenv.config();

// Import passport configuration after dotenv is configured
require('./config/passport');

// Import routes
const authRoutes = require("./routes/auth");
const clubRoutes = require("./routes/club.routes");
const eventRoutes = require("./routes/event.routes");
const registrationRoutes = require("./routes/registration.routes");
const joinClubRoutes = require("./routes/joinClub.routes");

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration - must come before session
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Correct middleware order:

// 1. CORS (first)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization','set-cookie']
}));

// 2. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Session middleware (MUST come before Passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false, // Changed to false
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    autoRemove: 'interval',
    autoRemoveInterval: 10 // Minutes
  }),
  cookie: {
    secure: false, // Should be true in production
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// 4. Passport middleware (AFTER session)
app.use(passport.initialize());
app.use((req, res, next) => {
  console.log('--- Session Debug ---');
  console.log('Session ID:', req.sessionID);
  console.log('Session data:', req.session);
  console.log('Authenticated:', req.isAuthenticated());
  console.log('User:', req.user);
  next();
});
app.use(passport.session());


app.use("/api/auth", authRoutes);

// Protected routes - require authentication
app.use("/api/clubs",  clubRoutes);
app.use("/api/events",  eventRoutes);
app.use('/api', registrationRoutes);
app.use('/api/joinClub', joinClubRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});