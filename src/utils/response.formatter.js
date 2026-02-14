/**
 * Format success response
 * @param {*} data - Response data
 * @param {string} message - Optional success message
 * @returns {Object} Formatted success response
 */
export const formatSuccessResponse = (data, message = null) => {
  const response = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  return response;
};

/**
 * Format error response
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {*} details - Optional error details
 * @returns {Object} Formatted error response
 */
export const formatErrorResponse = (code, message, details = null) => {
  const response = {
    success: false,
    error: {
      code,
      message,
    },
  };

  if (details) {
    response.error.details = details;
  }

  return response;
};

export default {
  formatSuccessResponse,
  formatErrorResponse,
};
