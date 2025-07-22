const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();
//
// Middleware
app.use(cors({
    origin: 'http://localhost:5173',  // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow necessary HTTP methods
    credentials: true,  // Required to handle cookies
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// Session middleware
app.use(
    session({
        secret: 'your_session_secret_key_here',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017/ticket_booking',
            collectionName: 'sessions',
        }),
        cookie: {
            maxAge: 1000 * 60 * 60, // 1 hour
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        },
    })
);



// Routes
console.log('Mounting auth routes');
app.use('/api/auth', authRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});