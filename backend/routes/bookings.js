const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { auth } = require('../middleware/auth');

// Get user's bookings
router.get('/user', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ guest: req.user._id })
            .populate('listing')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get listing's bookings
router.get('/listing/:id', auth, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Check if user is the host
        if (listing.host.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const bookings = await Booking.find({ listing: req.params.id })
            .populate('guest', 'name email')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create booking
router.post('/', auth, async (req, res) => {
    try {
        const {
            listingId,
            checkInDate,
            checkInTime,
            checkOutDate,
            checkOutTime,
            numberOfGuests,
            specialRequests
        } = req.body;

        // Validate listing exists
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Create booking
        const booking = new Booking({
            listing: listingId,
            guest: req.user._id,
            checkIn: {
                date: checkInDate,
                time: checkInTime
            },
            checkOut: {
                date: checkOutDate,
                time: checkOutTime
            },
            numberOfGuests,
            specialRequests
        });

        // Calculate total price
        await booking.calculateTotalPrice();

        // Save booking
        await booking.save();

        res.status(201).json(booking);
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

// Get all bookings for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({
            $or: [
                { guest: req.user._id },
                { 'listing.owner': req.user._id }
            ]
        })
            .populate('listing')
            .populate('guest', 'name email')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('listing')
            .populate('guest', 'name email');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is authorized to view this booking
        if (booking.guest._id.toString() !== req.user._id.toString() &&
            booking.listing.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update booking status
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is authorized to update this booking
        const listing = await Listing.findById(booking.listing);
        if (booking.guest.toString() !== req.user._id.toString() &&
            listing.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();

        res.json(booking);
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 