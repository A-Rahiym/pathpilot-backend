import * as geminiService from '../services/gemini.service.js';
import { formatSuccessResponse, formatErrorResponse } from '../utils/response.formatter.js';
import { APP_CONFIG } from '../config/app.config.js';

/**
 * Analyze image for obstacle detection
 * POST /api/camera/analyze-obstacles
 */
export const analyzeObstacles = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json(
        formatErrorResponse('VALIDATION_ERROR', 'Image file is required')
      );
    }

    // Validate file type
    if (!APP_CONFIG.FILE_UPLOAD.ALLOWED_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json(
        formatErrorResponse(
          'VALIDATION_ERROR',
          `Invalid file type. Allowed types: ${APP_CONFIG.FILE_UPLOAD.ALLOWED_TYPES.join(', ')}`
        )
      );
    }

    // Validate file size
    if (req.file.size > APP_CONFIG.FILE_UPLOAD.MAX_SIZE) {
      return res.status(400).json(
        formatErrorResponse(
          'VALIDATION_ERROR',
          `File size exceeds maximum allowed size of ${APP_CONFIG.FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB`
        )
      );
    }

    // Parse context if provided
    let context = {};
    if (req.body.context) {
      try {
        context = typeof req.body.context === 'string' 
          ? JSON.parse(req.body.context)
          : req.body.context;
      } catch (parseError) {
        console.warn('Failed to parse context, using default:', parseError);
      }
    }

    // Start timing
    const startTime = Date.now();

    // Call Gemini service to analyze image
    const result = await geminiService.analyzeImageForObstacles(req.file.buffer, context);

    // Calculate analysis time
    const analysisTime = (Date.now() - startTime) / 1000;
    result.data.analysisTime = analysisTime;

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in analyzeObstacles controller:', error);
    return res.status(500).json(
      formatErrorResponse('IMAGE_ANALYSIS_ERROR', error.message)
    );
  }
};

export default {
  analyzeObstacles,
};
