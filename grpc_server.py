import grpc
from concurrent import futures
import time
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime

# Import generated classes
import intent_pb2
import intent_pb2_grpc

# Load environment variables
load_dotenv()

# Configure Google Gemini
GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Warning: GOOGLE_GEMINI_API_KEY not found in environment variables.")

genai.configure(api_key=GEMINI_API_KEY)

class IntentServiceServicer(intent_pb2_grpc.IntentServiceServicer):
    def ParseIntent(self, request, context):
        transcribed_text = request.transcribed_text
        print(f"Received request: {transcribed_text}")

        if not transcribed_text:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details('transcribed_text is required')
            return intent_pb2.ParseIntentResponse()

        try:
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
"""
            # Reuse the same prompt structure as app.py for consistency
            
            response = model.generate_content(prompt)
            parsed_response = json.loads(response.text)
            
            return intent_pb2.ParseIntentResponse(
                intent=parsed_response.get("intent", "unknown"),
                destination=parsed_response.get("destination"),
                category=parsed_response.get("category"),
                confidence=parsed_response.get("confidence", 0.0),
                original_text=transcribed_text,
                timestamp=datetime.now().isoformat()
            )

        except Exception as e:
            print(f"Error processing request: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return intent_pb2.ParseIntentResponse()

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    intent_pb2_grpc.add_IntentServiceServicer_to_server(IntentServiceServicer(), server)
    server.add_insecure_port('[::]:50051')
    print("gRPC Server started on port 50051")
    server.start()
    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == '__main__':
    serve()
