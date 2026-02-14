import { formatErrorResponse } from '../utils/response.formatter.js';
import logger from '../utils/logger.js';

/**
 * Global error handling middleware
 * Must be placed after all routes
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Send error response
  res.status(statusCode).json(
    formatErrorResponse(
      'INTERNAL_SERVER_ERROR',
      err.message || 'An unexpected error occurred',
      process.env.NODE_ENV === 'development' ? err.stack : undefined
    )
  );
};

/**
 * Handle 404 - Route not found
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json(
    formatErrorResponse(
      'ROUTE_NOT_FOUND',
      `Route ${req.method} ${req.path} not found`
    )
  );
};

export default {
  errorHandler,
  notFoundHandler,
};
