import * as geminiService from '../services/gemini.service.js';
import { formatSuccessResponse, formatErrorResponse } from '../utils/response.formatter.js';

/**
 * Parse voice command intent
 * POST /api/speech/parse-intent
 */
export const parseIntent = async (req, res) => {
  try {
    const { transcribedText } = req.body;

    if (!transcribedText || typeof transcribedText !== 'string') {
      return res.status(400).json(
        formatErrorResponse('VALIDATION_ERROR', 'Transcribed text is required and must be a string')
      );
    }

    if (transcribedText.trim().length === 0) {
      return res.status(400).json(
        formatErrorResponse('VALIDATION_ERROR', 'Transcribed text cannot be empty')
      );
    }

    // Call Gemini service to parse intent
    const result = await geminiService.parseNavigationIntent(transcribedText);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in parseIntent controller:', error);
    return res.status(500).json(
      formatErrorResponse('INTENT_PARSE_ERROR', error.message)
    );
  }
};

export default {
  parseIntent,
};
