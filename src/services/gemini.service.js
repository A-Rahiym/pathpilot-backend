import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async processCommand(text) {
    const prompt = `You are a navigation assistant. Analyze this voice command and extract:
1. Destination (if mentioned)
2. Route preferences (fastest, shortest, scenic, etc.)
3. Action (get directions, show route, etc.)
4. Any special requests (avoid highways, wheelchair accessible, etc.)

Command: "${text}"

Respond in JSON format with keys: destination, preferences, action, specialRequests`;

    const result = await this.model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      return JSON.parse(responseText);
    } catch (e) {
      return {
        destination: null,
        preferences: [],
        action: 'process',
        specialRequests: null,
        rawResponse: responseText
      };
    }
  }

  async generateInstructions(route) {
    const prompt = `Based on this route information, generate clear, concise turn-by-turn navigation instructions:
Route: ${JSON.stringify(route)}

Format as an array of instruction objects with: step, instruction, distance, duration`;

    const result = await this.model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      return JSON.parse(responseText);
    } catch (e) {
      return {
        raw: responseText,
        instructions: []
      };
    }
  }
}

export default new GeminiService();
