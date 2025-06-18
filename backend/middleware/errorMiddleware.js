// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error details:', {
        name: err.name,
        message: err.message,
        code: err.code,
        stack: err.stack
    });

    // Handle payload too large error
    if (err instanceof SyntaxError || err.type === 'entity.too.large') {
        return res.status(413).json({
            message: 'Request entity too large',
            details: 'The uploaded file exceeds the size limit (50MB)'
        });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            details: Object.values(err.errors).map(error => error.message)
        });
    }

    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            message: 'Duplicate Error',
            details: 'A record with this information already exists'
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid Token',
            details: 'Please log in again'
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong!',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = { errorHandler }; 