import geminiService from '../services/geminiService.js';

/**
 * Parse voice command intent
 */
export const parseIntent = async (req, res) => {
  try {
    const { transcribedText } = req.body;

    if (!transcribedText || typeof transcribedText !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'transcribedText is required and must be a string'
        }
      });
    }

    const result = await geminiService.parseIntent(transcribedText);

    res.json({
      success: true,
      data: {
        ...result,
        originalText: transcribedText,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Parse intent error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTENT_PARSE_ERROR',
        message: 'Failed to parse voice command intent',
        details: error.message
      }
    });
  }
};
