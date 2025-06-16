/**
 * Combined response and error handling middleware for Express.js
 * - Adds res.success() for standardized success responses
 * - Adds res.error() for manual error responses
 * - Automatically catches async errors and formats them
 * - Handles HTTP exceptions with custom status codes
 * - Environment-aware error details (detailed in development, minimal in production)
 */
const responseMiddleware = () => {
  return (req, res, next) => {
    // Store original res.json to restore later if needed
    const originalJson = res.json;

    // Success response method
    res.success = (data, statusCode = 200) => {
      res.status(statusCode).json({
        status: 'success',
        data: data
      });
    };

    // Manual error response method
    res.error = (message, statusCode = 500, details = {}) => {
      res.status(statusCode).json({
        status: 'error',
        message: message,
        ...details
      });
    };

    // Wrap res.json to handle async errors and ensure consistent format
    res.json = function (obj) {
      // If it's an error object with status/statusCode, treat it as an error
      if (obj instanceof Error || (obj && (obj.status || obj.statusCode))) {
        const statusCode = obj.status || obj.statusCode || 500;
        const message = obj.message || 'Internal Server Error';
        const details = process.env.NODE_ENV === 'development' 
          ? { stack: obj.stack } 
          : {};
        return originalJson.call(this, {
          status: 'error',
          message: message,
          ...details
        });
      }
      // Otherwise, treat as success
      return originalJson.call(this, {
        status: 'success',
        data: obj
      });
    };

    // Async error catching wrapper
    const asyncHandler = (fn) => (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error(err.stack);
        const statusCode = err.status || err.statusCode || 500;
        const message = err.message || 'Internal Server Error';
        const details = process.env.NODE_ENV === 'development' 
          ? { stack: err.stack } 
          : {};
        res.status(statusCode).json({
          status: 'error',
          message: message,
          ...details
        });
      });
    };

    // Override res.send to integrate with asyncHandler for route handlers
    const originalSend = res.send;
    res.send = function (body) {
      if (typeof body === 'function') {
        // If a function is passed (route handler), wrap it with asyncHandler
        asyncHandler(body)(req, res, next);
      } else {
        originalSend.call(this, body);
      }
    };

    next();
  };
};

/**
 * Example usage:
 * 
 * const express = require('express');
 * const responseMiddleware = require('./responseMiddleware');
 * 
 * const app = express();
 * 
 * app.use(responseMiddleware());
 * 
 * // Success response
 * app.get('/example', (req, res) => {
 *   res.success({ message: 'Hello World' }, 200);
 * });
 * 
 * // Manual error response
 * app.get('/badrequest', (req, res) => {
 *   res.error('Invalid input', 400);
 * });
 * 
 * // Throwing HTTP exception
 * app.get('/notfound', (req, res) => {
 *   const err = new Error('Resource not found');
 *   err.status = 404;
 *   throw err;
 * });
 * 
 * // Async route with error
 * app.get('/async-error', async (req, res) => {
 *   throw new Error('Async failure');
 * });
 * 
 * app.listen(3000, () => console.log('Server running on port 3000'));
 */

export default responseMiddleware;