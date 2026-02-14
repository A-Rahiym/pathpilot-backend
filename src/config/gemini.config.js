import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Model configurations
const MODEL_CONFIGS = {
  TEXT: {
    model: 'gemini-pro',
    generationConfig: {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 1024,
    },
  },
  VISION: {
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature: 0.3,
      topK: 32,
      topP: 1,
      maxOutputTokens: 2048,
    },
  },
};

/**
 * Get Gemini model instance
 * @param {string} type - Model type: 'TEXT' or 'VISION'
 * @returns {Object} Gemini model instance
 */
export const getGeminiModel = (type = 'TEXT') => {
  const config = MODEL_CONFIGS[type];
  if (!config) {
    throw new Error(`Invalid model type: ${type}`);
  }
  return genAI.getGenerativeModel(config);
};

/**
 * Validate Gemini API key
 * @returns {boolean} True if API key is configured
 */
export const validateGeminiKey = () => {
  return !!process.env.GOOGLE_GEMINI_API_KEY;
};

export default {
  getGeminiModel,
  validateGeminiKey,
  MODEL_CONFIGS,
};
