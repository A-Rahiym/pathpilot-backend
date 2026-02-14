import { formatErrorResponse } from '../utils/response.formatter.js';

/**
 * Validate API keys are configured
 */
export const validateApiKeys = (req, res, next) => {
  const missingKeys = [];

  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    missingKeys.push('GOOGLE_GEMINI_API_KEY');
  }

  if (!process.env.GOOGLE_MAPS_API_KEY) {
    missingKeys.push('GOOGLE_MAPS_API_KEY');
  }

  if (missingKeys.length > 0) {
    return res.status(500).json(
      formatErrorResponse(
        'CONFIGURATION_ERROR',
        'Server configuration error: Missing API keys',
        { missingKeys }
      )
    );
  }

  next();
};

/**
 * Validate request body has required fields
 * @param {string[]} requiredFields - Array of required field names
 */
export const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];

    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json(
        formatErrorResponse(
          'VALIDATION_ERROR',
          'Missing required fields',
          { missingFields }
        )
      );
    }

    next();
  };
};

export default {
  validateApiKeys,
  validateRequiredFields,
};
