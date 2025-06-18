const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    totalNights: {
        type: Number,
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    },
    guestMultiplier: {
        type: Number,
        required: true,
        default: 1
    },
    addOns: {
        breakfast: {
            type: Boolean,
            default: false
        },
        parking: {
            type: Boolean,
            default: false
        },
        extraBed: {
            type: Boolean,
            default: false
        },
        earlyCheckIn: {
            type: Boolean,
            default: false
        },
        lateCheckOut: {
            type: Boolean,
            default: false
        }
    },
    priceBreakdown: {
        basePrice: {
            type: Number,
            required: true
        },
        addOnsPrice: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
        numberOfNights: {
            type: Number,
            required: true
        }
    },
    specialRequests: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
}, {
    timestamps: true
});

// Validate dates
bookingSchema.pre('save', function (next) {
    if (this.checkIn >= this.checkOut) {
        next(new Error('Check-in date must be before check-out date'));
        return;
    }
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 