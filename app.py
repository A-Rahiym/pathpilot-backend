import os
import json
import uvicorn
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Configure Google Gemini
GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Warning: GOOGLE_GEMINI_API_KEY not found in environment variables.")

genai.configure(api_key=GEMINI_API_KEY)

# Initialize FastAPI app
app = FastAPI(title="PathPilot Intent Service", description="Service to parse voice commands for navigation intent")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VoiceCommand(BaseModel):
    transcribedText: str

class IntentResponse(BaseModel):
    intent: str
    destination: str | None = None
    category: str | None = None
    confidence: float

@app.post("/parse-intent", response_model=dict)
async def parse_intent(command: VoiceCommand):
    """
    Parse voice command to extract navigation intent using Google Gemini.
    """
    try:
        transcribed_text = command.transcribedText
        
        if not transcribed_text:
            raise HTTPException(status_code=400, detail="transcribedText is required")

        # Configuration for the model
        generation_config = {
            "temperature": 0.3,
            "response_mime_type": "application/json",
        }

        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash", 
            generation_config=generation_config
        )

        prompt = f"""You are a navigation assistant for visually impaired users. Analyze this voice command and extract structured information.

Voice Command: "{transcribed_text}"

Extract and return JSON with these fields:
{{
  "intent": "navigate" | "location" | "nearby" | "help" | "stop_navigation",
  "destination": "destination name or null",
  "category": "place category if asking for nearby (e.g., pharmacy, restaurant) or null",
  "confidence": 0.0 to 1.0
}}

Examples:
- "Navigate to the pharmacy" -> {{"intent": "navigate", "destination": "pharmacy", "category": null, "confidence": 0.95}}
- "Where am I?" -> {{"intent": "location", "destination": null, "category": null, "confidence": 1.0}}
- "Find nearby restaurants" -> {{"intent": "nearby", "destination": null, "category": "restaurant", "confidence": 0.9}}
- "Stop navigation" -> {{"intent": "stop_navigation", "destination": null, "category": null, "confidence": 1.0}}"""

        response = model.generate_content(prompt)
        
        # Parse the response text as JSON
        try:
            parsed_response = json.loads(response.text)
            return {
                "success": True,
                "data": {
                    **parsed_response,
                    "originalText": transcribed_text,
                    "timestamp": datetime.now().isoformat()
                }
            }
        except json.JSONDecodeError:
             # Fallback if model doesn't return valid JSON for some reason, though response_mime_type help
             print(f"Failed to parse JSON: {response.text}")
             raise HTTPException(status_code=500, detail="Failed to parse intent from model response")

    except Exception as e:
        print(f"Error parsing intent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
