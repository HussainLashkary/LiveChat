const createHttpError = require('http-errors'); // Optional for HTTP-specific errors

// Error handling middleware
function errorHandler(err, req, res, next) {
    console.error(`error at ${req.originalUrl}:`, err.message || err); // Log the error for debugging

    // i wrote this because err handler would block the code i wrote for otp not expired 
    if (err.message === "otp code not expired") {
        // Handle the error by rendering the OTP page
        return res.render('otpPage', {
            user: req.session.user, // Access user data from session
            errorMessage: err.message,
            message: null // Or any additional data you might need
        });
    }

    // Check if the error is an HTTP error
    if (err instanceof createHttpError.HttpError) {
        res.status(err.status || 500).json({
            error: {
                message: err.message || 'An error occurred',
                status: err.status
            }
        });
        return;
    }

    // Handle validation errors (if using a validation library)
    if (err.name === 'ValidationError') {
        res.status(400).json({
            error: {
                message: err.message || 'Validation failed',
                details: err.errors // Specific details from the validation library
            }
        });
        return;
    }

    // Handle database or ORM-specific errors
    if (err.name === 'MongoError') {
        res.status(500).json({
            error: {
                message: 'A database error occurred',
                details: err.message
            }
        });
        return;
    }

    // Handle unknown errors or exceptions
    res.status(500).json({
        error: {
            message: 'Internal Server Error',
            details: err.message || 'An unexpected error occurred'
        }
    });
}

// Catch unhandled routes (404 middleware)
function notFoundHandler(req, res, next) {
    const error = new createHttpError.NotFound('Route not found');
    next(error);
}

module.exports = {
    errorHandler,
    notFoundHandler
}

