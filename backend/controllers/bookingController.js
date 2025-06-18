const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { listingId, checkIn, checkOut, guests, totalPrice, totalNights } = req.body;

        // Validate required fields
        if (!listingId || !checkIn || !checkOut || !guests || !totalPrice || !totalNights) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Validate dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            return res.status(400).json({
                success: false,
                message: "Check-in date cannot be in the past",
            });
        }

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({
                success: false,
                message: "Check-out date must be after check-in date",
            });
        }

        // Check if listing exists
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found",
            });
        }

        // Check if dates are available
        const existingBookings = await Booking.find({
            listing: listingId,
            status: { $in: ["confirmed", "pending"] },
            $or: [
                {
                    checkIn: { $lte: checkOutDate },
                    checkOut: { $gte: checkInDate },
                },
            ],
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({
                success: false,
                message: "These dates are not available",
            });
        }

        // Check guest limit
        if (guests > listing.maxGuests) {
            return res.status(400).json({
                success: false,
                message: `Maximum ${listing.maxGuests} guests allowed`,
            });
        }

        // Create booking
        const booking = await Booking.create({
            user: req.user._id,
            listing: listingId,
            checkIn,
            checkOut,
            guests,
            totalPrice,
            totalNights,
            status: "pending",
        });

        // Populate listing details
        await booking.populate("listing");

        res.status(201).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        console.error("Create booking error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error creating booking",
        });
    }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("listing")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        console.error("Get user bookings error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching bookings",
        });
    }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("listing");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Check if user owns the booking
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to access this booking",
            });
        }

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        console.error("Get booking error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching booking",
        });
    }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Check if user owns the booking
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this booking",
            });
        }

        // Validate status
        if (!["pending", "confirmed", "cancelled"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        console.error("Update booking status error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error updating booking status",
        });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Check if user owns the booking
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this booking",
            });
        }

        // Check if booking can be cancelled
        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking is already cancelled",
            });
        }

        const checkInDate = new Date(booking.checkIn);
        const today = new Date();
        if (checkInDate <= today) {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel a booking that has already started",
            });
        }

        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        console.error("Cancel booking error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error cancelling booking",
        });
    }
}; 