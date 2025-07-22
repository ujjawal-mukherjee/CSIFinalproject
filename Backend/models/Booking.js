const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: [true, 'User email is required'],
        match: [/\S+@\S+\.\S+/, 'Email is invalid'],
    },
    movie: {
        title: {
            type: String,
            required: [true, 'Movie title is required'],
        },
        id: {
            type: String,
            required: [true, 'Movie ID is required'],
        },
    },
    seats: {
        type: [Number],
        required: [true, 'Seats are required'],
    },
    showtime: {
        type: String,
        required: [true, 'Showtime is required'],
    },
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
    },
    bookingDate: {
        type: String,
        required: [true, 'Booking date is required'],
    },
    paymentIntentId: {
        type: String,
        required: [true, 'Payment intent ID is required'],
    },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);