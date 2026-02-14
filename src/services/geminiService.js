import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/config.js';

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
  }

  /**
   * Parse voice command to extract navigation intent
   * @param {string} transcribedText - The text from speech-to-text
   * @returns {Promise<Object>} Parsed intent object
   */
  async parseIntent(transcribedText) {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-latest',
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json"
        }
      });

      const prompt = `You are a navigation assistant for visually impaired users. Analyze this voice command and extract structured information.

Voice Command: "${transcribedText}"

Extract and return JSON with these fields:
{
  "intent": "navigate" | "location" | "nearby" | "help" | "stop_navigation",
  "destination": "destination name or null",
  "category": "place category if asking for nearby (e.g., pharmacy, restaurant) or null",
  "confidence": 0.0 to 1.0
}

Examples:
- "Navigate to the pharmacy" -> {"intent": "navigate", "destination": "pharmacy", "category": null, "confidence": 0.95}
- "Where am I?" -> {"intent": "location", "destination": null, "category": null, "confidence": 1.0}
- "Find nearby restaurants" -> {"intent": "nearby", "destination": null, "category": "restaurant", "confidence": 0.9}
- "Stop navigation" -> {"intent": "stop_navigation", "destination": null, "category": null, "confidence": 1.0}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Error parsing intent:', error);
      throw new Error('Failed to parse voice command intent');
    }
  }

  /**
   * Analyze image for obstacle detection
   * @param {Buffer} imageBuffer - The image data
   * @returns {Promise<Object>} Obstacle detection results
   */
  async analyzeImage(imageBuffer) {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json"
        }
      });

      const prompt = `You are helping a visually impaired person navigate safely. Analyze this image from their forward-facing camera.

Identify obstacles and provide guidance in JSON format:
{
  "status": "clear" | "obstacles_detected" | "danger",
  "obstacles": [
    {
      "direction": "left" | "center" | "right",
      "type": "person" | "vehicle" | "object" | "step" | "wall" | "pole" | "unknown",
      "distance": estimated distance in meters (0.5 to 10),
      "urgency": "safe" | "caution" | "danger"
    }
  ],
  "guidance": "brief verbal guidance message",
  "recommendation": "continue" | "slow_down" | "stop" | "turn_left" | "turn_right"
}

Focus on:
- Immediate obstacles within 5 meters
- Direction relative to camera view (left, center, right)
- Safety priority: walking hazards, moving vehicles, drop-offs

Be concise and actionable.`;

      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: 'image/jpeg'
        }
      };

      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text();
      
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image for obstacles');
    }
  }
}

export default new GeminiService();
