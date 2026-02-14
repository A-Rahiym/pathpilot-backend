import geminiService from '../services/geminiService.js';

/**
 * Analyze image for obstacle detection
 */
export const analyzeObstacles = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_IMAGE',
          message: 'Image file is required'
        }
      });
    }

    const imageBuffer = req.file.buffer;
    const context = req.body.context ? JSON.parse(req.body.context) : {};

    const startTime = Date.now();
    const result = await geminiService.analyzeImage(imageBuffer);
    const analysisTime = (Date.now() - startTime) / 1000;

    res.json({
      success: true,
      data: {
        ...result,
        context,
        timestamp: new Date().toISOString(),
        analysisTime: parseFloat(analysisTime.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'IMAGE_ANALYSIS_ERROR',
        message: 'Failed to analyze image for obstacles',
        details: error.message
      }
    });
  }
};
