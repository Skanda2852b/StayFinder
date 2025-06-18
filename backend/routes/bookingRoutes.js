const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking
} = require('../controllers/bookingController');

// Create a new booking
router.post('/', protect, createBooking);

// Get user's bookings
router.get('/user', protect, getUserBookings);

// Get booking by ID
router.get('/:id', protect, getBookingById);

// Update booking status
router.patch('/:id/status', protect, updateBookingStatus);

// Cancel booking
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router; 