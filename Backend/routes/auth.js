const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Booking = require('../models/Booking');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe('sk_test_')

console.log('Auth routes loaded');

// Signup Route
router.post('/signup', async (req, res) => {
    console.log('Signup route hit:', req.body);
    try {
        const { name, email, phone, password, confirmPassword } = req.body;

        // Validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (name.length < 2) {
            return res.status(400).json({ message: 'Name must be at least 2 characters' });
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: 'Email is invalid' });
        }
        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: 'Phone number must be 10 digits' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save user
        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
        });
        await user.save();

        // Store user in session
        req.session.user = { id: user._id, name: user.name, email: user.email, phone: user.phone };

        // Explicitly save the session
        req.session.save(err => {
            if (err) {
                console.error('Error saving session:', err);
                return res.status(500).json({ message: 'Session save error' });
            }
            console.log('Session after signup:', req.session);
            res.status(201).json({
                message: 'User registered successfully',
                user: req.session.user,
            });
        });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    console.log('Login route hit:', req.body);
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: 'Email is invalid' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Store user in session
        req.session.user = { id: user._id, name: user.name, email: user.email, phone: user.phone };

        // Explicitly save the session
        req.session.save(err => {
            if (err) {
                console.error('Error saving session:', err);
                return res.status(500).json({ message: 'Session save error' });
            }
            console.log('Session after login:', req.session);
            res.status(200).json({
                message: 'Login successful',
                user: req.session.user,
            });
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Check Login Status
router.get('/check-login', (req, res) => {
    console.log('Check-login route hit:', req.session);
    if (req.session && req.session.user) {
        res.status(200).json({ user: req.session.user });
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    console.log('Logout route hit');
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

router.post('/create-payment-intent', async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { amount, currency, metadata, userEmail } = req.body;

        if (!amount || !currency || !userEmail || !metadata || !metadata.movieId || !metadata.seats || !metadata.showtime || !metadata.movieTitle) {
            console.error('Validation failed: Missing required fields');
            return res.status(400).json({ error: 'Missing required fields: ' + JSON.stringify({ amount, currency, userEmail, metadata }) });
        }

        // Verify user exists in MongoDB
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            console.error('User not found for email:', userEmail);
            return res.status(400).json({ error: 'Invalid user email' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log('PaymentIntent created:', paymentIntent.id);
        const booking = new Booking({
            userEmail,
            movie: {
                id: metadata.movieId,
                title: metadata.movieTitle,
            },
            seats: metadata.seats.split(',').map(Number),
            showtime: metadata.showtime,
            totalPrice: amount / 100,
            bookingDate: new Date().toLocaleDateString(),
            paymentIntentId: paymentIntent.id,
        });

        await booking.save();
        console.log('Booking saved:', booking._id);

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent or saving booking:', error.message);
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
});

router.get('/check-seat-status', async (req, res) => {
    try {
        const { movieId, showtime } = req.query;

        if (!movieId || !showtime) {
            return res.status(400).json({ error: 'movieId and showtime are required' });
        }

        // Find all bookings for the given movieId and showtime
        const bookings = await Booking.find({ 'movie.id': movieId, showtime });
        // Flatten all seat arrays into a single array of booked seat numbers
        const bookedSeats = bookings.reduce((acc, booking) => {
            return [...acc, ...booking.seats];
        }, []);

        console.log(`Booked seats for movieId ${movieId} and showtime ${showtime}:`, bookedSeats);
        res.status(200).json({ bookedSeats });
    } catch (error) {
        console.error('Error checking seat status:', error.message);
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
});
module.exports = router;