const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Listing = require('../models/Listing');
const { auth } = require('../middleware/auth');

// Helper function to validate base64 image
const isValidBase64Image = (str) => {
    if (!str || typeof str !== 'string') return false;
    // Check if it's a valid base64 data URL format
    const regex = /^data:image\/(jpeg|jpg|png|gif);base64,/;
    if (!regex.test(str)) return false;
    // Check the actual base64 content
    const base64Data = str.split(',')[1];
    try {
        return btoa(atob(base64Data)) === base64Data;
    } catch (err) {
        return false;
    }
};

// Helper function to check image size
const getBase64Size = (base64String) => {
    // Remove data URL prefix if present
    const base64Data = base64String.split(',')[1] || base64String;
    // Calculate size in bytes
    return Math.ceil(atob(base64Data).length);
};

// Get all listings
router.get('/', async (req, res) => {
    try {
        const { location, minPrice, maxPrice, propertyType, bedrooms, guests } = req.query;
        const query = {};

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (propertyType) query.type = propertyType;
        if (bedrooms) query.bedrooms = Number(bedrooms);
        if (guests) query.maxGuests = { $gte: Number(guests) };

        const listings = await Listing.find(query);
        res.json(listings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single listing
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.json(listing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create listing
router.post('/', auth, [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('location').notEmpty().withMessage('Location is required'),
    body('type').isIn(['hotel', 'apartment', 'house']).withMessage('Invalid property type'),
    body('maxGuests').isNumeric().withMessage('Max guests must be a number'),
    body('bedrooms').isNumeric().withMessage('Bedrooms must be a number'),
    body('hasBathroom').isBoolean().withMessage('hasBathroom must be a boolean'),
    body('image')
        .notEmpty().withMessage('Image is required')
        .custom((value) => {
            if (!isValidBase64Image(value)) {
                throw new Error('Invalid image format. Must be a valid base64 image (JPEG, PNG, or GIF).');
            }
            const sizeInBytes = getBase64Size(value);
            if (sizeInBytes > 50 * 1024 * 1024) { // 50MB limit
                throw new Error('Image size must be less than 50MB');
            }
            return true;
        }),
    body('amenities').optional().isArray().withMessage('Amenities must be an array')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({
                message: 'Validation error',
                details: errors.array().map(err => err.msg).join(', '),
                errors: errors.array()
            });
        }

        console.log('Creating new listing with data:', {
            ...req.body,
            image: req.body.image ? `${req.body.image.substring(0, 50)}...` : 'none'
        });

        // Create listing object
        const listing = new Listing({
            ...req.body,
            host: req.user.userId,
            amenities: req.body.amenities || []
        });

        // Save listing
        try {
            const savedListing = await listing.save();
            console.log('Listing created successfully with ID:', savedListing._id);
            res.status(201).json(savedListing);
        } catch (saveError) {
            console.error('Error saving listing:', {
                name: saveError.name,
                code: saveError.code,
                message: saveError.message,
                errors: saveError.errors
            });

            // Handle specific MongoDB errors
            if (saveError.name === 'MongoServerError') {
                if (saveError.code === 16793) {
                    return res.status(413).json({
                        message: 'Document size too large',
                        details: 'The image might be too large for MongoDB storage. Try using a smaller image.'
                    });
                }
                if (saveError.code === 11000) {
                    return res.status(400).json({
                        message: 'Duplicate key error',
                        details: `A listing with this ${Object.keys(saveError.keyPattern)[0]} already exists.`
                    });
                }
            }

            if (saveError.name === 'ValidationError') {
                return res.status(400).json({
                    message: 'Validation error',
                    details: Object.values(saveError.errors).map(err => err.message).join(', '),
                    errors: saveError.errors
                });
            }

            // If it's not a known error, throw it to be caught by the general error handler
            throw saveError;
        }
    } catch (err) {
        console.error('Error creating listing:', {
            name: err.name,
            message: err.message,
            stack: err.stack
        });

        // Send a detailed error response
        res.status(500).json({
            message: 'Server error while creating listing',
            details: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
            error: process.env.NODE_ENV === 'development' ? {
                name: err.name,
                message: err.message,
                stack: err.stack
            } : undefined
        });
    }
});

// Update listing
router.put('/:id', auth, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.host.toString() !== req.user.userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(updatedListing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete listing
router.delete('/:id', auth, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.host.toString() !== req.user.userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await listing.deleteOne();
        res.json({ message: 'Listing removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add review to listing
router.post('/:id/reviews', auth, [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Check if user has already reviewed
        const hasReviewed = listing.reviews.some(
            review => review.user.toString() === req.user.userId.toString()
        );

        if (hasReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this listing' });
        }

        const review = {
            user: req.user.userId,
            rating: req.body.rating,
            comment: req.body.comment
        };

        listing.reviews.push(review);

        // Update average rating
        const totalRating = listing.reviews.reduce((acc, item) => item.rating + acc, 0);
        listing.rating = totalRating / listing.reviews.length;

        await listing.save();
        res.json(listing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 