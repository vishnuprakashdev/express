export function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(err.fields && { fields: err.fields }), // optional: list of problematic fields
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}
