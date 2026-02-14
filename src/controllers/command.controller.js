import geminiService from '../services/gemini.service.js';

export const processCommand = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const parsedCommand = await geminiService.processCommand(text);

    res.json({
      success: true,
      command: parsedCommand,
      originalText: text
    });
  } catch (error) {
    next(error);
  }
};

export const generateInstructions = async (req, res, next) => {
  try {
    const { route } = req.body;

    if (!route) {
      return res.status(400).json({ error: 'Route data is required' });
    }

    const instructions = await geminiService.generateInstructions(route);

    res.json({
      success: true,
      instructions
    });
  } catch (error) {
    next(error);
  }
};
