import rateLimit from 'express-rate-limit';
import { APP_CONFIG } from '../config/app.config.js';
import { formatErrorResponse } from '../utils/response.formatter.js';

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: APP_CONFIG.RATE_LIMIT.WINDOW_MS,
  max: APP_CONFIG.RATE_LIMIT.MAX_REQUESTS,
  message: formatErrorResponse(
    'RATE_LIMIT_EXCEEDED',
    'Too many requests, please try again later'
  ),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for resource-intensive endpoints
 * (e.g., image analysis, Gemini API calls)
 */
export const strictLimiter = rateLimit({
  windowMs: APP_CONFIG.RATE_LIMIT.WINDOW_MS,
  max: Math.floor(APP_CONFIG.RATE_LIMIT.MAX_REQUESTS / 2), // Half the general limit
  message: formatErrorResponse(
    'RATE_LIMIT_EXCEEDED',
    'Too many requests for this resource, please try again later'
  ),
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  apiLimiter,
  strictLimiter,
};
