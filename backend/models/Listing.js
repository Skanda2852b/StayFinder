const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true,
        index: true
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // Basic validation for base64 image string
                return /^data:image\/(jpeg|jpg|png|gif);base64,/.test(v);
            },
            message: props => `${props.value} is not a valid base64 image string!`
        }
    },
    amenities: [{
        type: String
    }],
    maxGuests: {
        type: Number,
        required: true,
        min: 1
    },
    bedrooms: {
        type: Number,
        required: true,
        min: 0
    },
    hasBathroom: {
        type: Boolean,
        required: true,
        default: false
    },
    type: {
        type: String,
        enum: ['hotel', 'apartment', 'house'],
        required: true
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware for validation and logging
listingSchema.pre('save', function (next) {
    console.log('Pre-save middleware triggered for listing:', {
        id: this._id,
        title: this.title,
        imageLength: this.image ? this.image.length : 0,
        isNew: this.isNew,
        modifiedPaths: this.modifiedPaths()
    });

    // Validate image size
    if (this.image) {
        const base64Data = this.image.split(',')[1] || this.image;
        const sizeInBytes = Buffer.from(base64Data, 'base64').length;
        console.log('Image size:', {
            bytes: sizeInBytes,
            mb: (sizeInBytes / (1024 * 1024)).toFixed(2) + 'MB'
        });

        if (sizeInBytes > 16 * 1024 * 1024) { // 16MB MongoDB document size limit
            const err = new Error('Image size exceeds MongoDB document size limit (16MB)');
            err.name = 'ValidationError';
            return next(err);
        }
    }

    // Update timestamps
    this.updatedAt = Date.now();
    next();
});

// Post-save middleware for logging
listingSchema.post('save', function (doc, next) {
    console.log('Listing saved successfully:', {
        id: doc._id,
        title: doc.title,
        host: doc.host
    });
    next();
});

// Error handling middleware
listingSchema.post('save', function (error, doc, next) {
    if (error) {
        console.error('Error saving listing:', {
            error: {
                name: error.name,
                message: error.message,
                code: error.code
            },
            document: {
                id: doc._id,
                title: doc.title
            }
        });
    }
    next(error);
});

module.exports = mongoose.model('Listing', listingSchema); 