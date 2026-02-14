# PathPilot Backend API

Backend service for PathPilot - A voice-first navigation assistant for visually impaired users.

## 🚀 Features

- **Voice Intent Parsing** - Convert voice commands to structured navigation intents using Google Gemini AI
- **Obstacle Detection** - Analyze camera images for real-time obstacle detection using Gemini Vision
- **Turn-by-turn Navigation** - Get directions and routes using Google Maps API
- **Location Services** - Reverse geocoding, nearby places search, and autocomplete
- **RESTful API** - Clean, well-documented endpoints for easy integration

## 📋 Prerequisites

- Node.js 18+ 
- Google Gemini API Key
- Google Maps API Key (with Places, Directions, and Geocoding enabled)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pathpilot-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```env
PORT=5000
NODE_ENV=development
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
MAX_FILE_SIZE=5242880
```

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Health Check
```http
GET /health
```
Returns server status.

---

### 1. Parse Voice Intent

Convert transcribed voice commands to structured navigation intents.

**Endpoint:** `POST /api/speech/parse-intent`

**Request Body:**
```json
{
  "transcribedText": "Navigate to the nearest pharmacy"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "intent": "navigate",
    "destination": "nearest pharmacy",
    "category": null,
    "confidence": 0.95,
    "originalText": "Navigate to the nearest pharmacy",
    "timestamp": "2024-02-12T10:30:00Z"
  }
}
```

**Intent Types:**
- `navigate` - Navigate to a destination
- `location` - Get current location address
- `nearby` - Find nearby places
- `help` - Show help/instructions
- `stop_navigation` - Stop current navigation

---

### 2. Analyze Obstacles

Analyze camera image for obstacle detection and navigation guidance.

**Endpoint:** `POST /api/camera/analyze-obstacles`

**Request:** `multipart/form-data`
- `image` (file): Camera image (JPEG, PNG, WebP, max 5MB)
- `context` (optional): JSON string with navigation context

**Example using curl:**
```bash
curl -X POST http://localhost:5000/api/camera/analyze-obstacles \
  -F "image=@camera-frame.jpg" \
  -F "context={\"navigating\":true}"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "obstacles_detected",
    "obstacles": [
      {
        "direction": "center",
        "type": "person",
        "distance": 2.5,
        "urgency": "caution"
      },
      {
        "direction": "left",
        "type": "step",
        "distance": 1.0,
        "urgency": "danger"
      }
    ],
    "guidance": "Step ahead at 1 meter, person in front at 2.5 meters",
    "recommendation": "slow_down",
    "timestamp": "2024-02-12T10:31:45Z",
    "analysisTime": 1.23
  }
}
```

---

### 3. Get Directions

Get turn-by-turn directions from origin to destination.

**Endpoint:** `POST /api/navigation/directions`

**Request Body:**
```json
{
  "origin": {
    "lat": 11.1234,
    "lng": 7.5678
  },
  "destination": "ABU Zaria Main Gate",
  "mode": "walking"
}
```

**Note:** `destination` can be either:
- Address string (will be geocoded automatically)
- Coordinates object `{lat, lng}`

**Travel Modes:** `walking` (default), `driving`, `bicycling`, `transit`

**Response:**
```json
{
  "success": true,
  "data": {
    "route": {
      "polyline": "encodedPolylineString...",
      "distance": {
        "text": "2.5 km",
        "value": 2500
      },
      "duration": {
        "text": "15 mins",
        "value": 900
      },
      "steps": [
        {
          "instruction": "Head north on Main Street",
          "distance": "500 m",
          "duration": "5 mins",
          "polyline": "...",
          "startLocation": { "lat": 11.1234, "lng": 7.5678 },
          "endLocation": { "lat": 11.1280, "lng": 7.5678 },
          "maneuver": "turn-left"
        }
      ],
      "startAddress": "Main Street, Zaria",
      "endAddress": "ABU Zaria Main Gate"
    },
    "origin": { "lat": 11.1234, "lng": 7.5678 },
    "destination": { "lat": 11.1500, "lng": 7.6000 }
  }
}
```

---

### 4. Reverse Geocode

Convert coordinates to a human-readable address.

**Endpoint:** `GET /api/location/reverse-geocode?lat=11.1234&lng=7.5678`

**Query Parameters:**
- `lat` - Latitude
- `lng` - Longitude

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "Main Street, Samaru, Zaria, Kaduna State, Nigeria",
    "coordinates": {
      "lat": 11.1234,
      "lng": 7.5678
    },
    "placeId": "ChIJ..."
  }
}
```

---

### 5. Find Nearby Places

Search for nearby places of a specific type.

**Endpoint:** `GET /api/location/nearby?lat=11.1234&lng=7.5678&type=pharmacy&radius=1500`

**Query Parameters:**
- `lat` - Latitude
- `lng` - Longitude
- `type` - Place type (pharmacy, hospital, restaurant, atm, bank, etc.)
- `radius` - Search radius in meters (optional, default: 1500)

**Response:**
```json
{
  "success": true,
  "data": {
    "places": [
      {
        "name": "City Pharmacy",
        "address": "Main Street, Zaria",
        "location": {
          "lat": 11.1300,
          "lng": 7.5700
        },
        "placeId": "ChIJ...",
        "rating": 4.2,
        "openNow": true,
        "types": ["pharmacy", "health", "store"]
      }
    ],
    "searchCenter": { "lat": 11.1234, "lng": 7.5678 },
    "type": "pharmacy",
    "radius": 1500,
    "count": 5
  }
}
```

---

### 6. Autocomplete Place Search

Get place suggestions based on user input.

**Endpoint:** `GET /api/location/autocomplete?query=pharmacy&lat=11.1234&lng=7.5678`

**Query Parameters:**
- `query` - Search query
- `lat` - Latitude (optional, for location bias)
- `lng` - Longitude (optional, for location bias)

**Response:**
```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "description": "City Pharmacy, Zaria, Nigeria",
        "placeId": "ChIJ...",
        "mainText": "City Pharmacy",
        "secondaryText": "Zaria, Nigeria"
      }
    ],
    "query": "pharmacy"
  }
}
```

---

### 7. Get Place Details

Get detailed information about a place using its place ID.

**Endpoint:** `GET /api/location/place/:placeId`

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "City Pharmacy",
    "address": "Main Street, Zaria, Kaduna State, Nigeria",
    "location": {
      "lat": 11.1300,
      "lng": 7.5700
    },
    "rating": 4.2,
    "phoneNumber": "+234 123 456 7890",
    "openNow": true
  }
}
```

---

## 🧪 Testing with Postman

### Import Collection

Create a Postman collection with the following requests:

**1. Health Check**
```
GET http://localhost:5000/health
```

**2. Parse Intent**
```
POST http://localhost:5000/api/speech/parse-intent
Content-Type: application/json

{
  "transcribedText": "Navigate to the nearest hospital"
}
```

**3. Analyze Obstacles**
```
POST http://localhost:5000/api/camera/analyze-obstacles
Content-Type: multipart/form-data

image: [select image file]
context: {"navigating": true}
```

**4. Get Directions**
```
POST http://localhost:5000/api/navigation/directions
Content-Type: application/json

{
  "origin": {"lat": 11.1234, "lng": 7.5678},
  "destination": "ABU Zaria Main Gate",
  "mode": "walking"
}
```

**5. Reverse Geocode**
```
GET http://localhost:5000/api/location/reverse-geocode?lat=11.1234&lng=7.5678
```

**6. Find Nearby**
```
GET http://localhost:5000/api/location/nearby?lat=11.1234&lng=7.5678&type=pharmacy
```

**7. Autocomplete**
```
GET http://localhost:5000/api/location/autocomplete?query=pharmacy&lat=11.1234&lng=7.5678
```

---

## 📁 Project Structure

```
pathpilot-backend/
├── src/
│   ├── config/
│   │   └── config.js              # Environment configuration
│   ├── controllers/
│   │   ├── speechController.js    # Speech intent parsing
│   │   ├── cameraController.js    # Image analysis
│   │   ├── navigationController.js # Routing
│   │   └── locationController.js  # Geocoding & places
│   ├── services/
│   │   ├── geminiService.js       # Gemini AI integration
│   │   └── mapsService.js         # Google Maps integration
│   ├── routes/
│   │   ├── speech.routes.js
│   │   ├── camera.routes.js
│   │   ├── navigation.routes.js
│   │   └── location.routes.js
│   ├── middleware/
│   │   ├── upload.js              # Multer image upload
│   │   └── errorHandler.js        # Error handling
│   └── app.js                     # Express app setup
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment | No (default: development) |
| `GOOGLE_GEMINI_API_KEY` | Gemini API key | Yes |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes |
| `ALLOWED_ORIGINS` | CORS allowed origins | No |
| `MAX_FILE_SIZE` | Max image upload size | No (default: 5MB) |

---

## 🛡️ Error Handling

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details (optional)"
  }
}
```

**Common Error Codes:**
- `INVALID_INPUT` - Missing or invalid request parameters
- `INTENT_PARSE_ERROR` - Failed to parse voice intent
- `IMAGE_ANALYSIS_ERROR` - Failed to analyze image
- `DIRECTIONS_ERROR` - Failed to get directions
- `GEOCODE_ERROR` - Failed to geocode location
- `FILE_TOO_LARGE` - Uploaded file exceeds size limit
- `INTERNAL_ERROR` - Unexpected server error

---

## 🚧 Development

### Running in Development Mode
```bash
npm run dev
```

This uses nodemon for automatic server restart on file changes.

### Code Style
- Use ES6+ features
- Async/await for asynchronous operations
- Descriptive variable and function names
- Comment complex logic

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📞 Support

For issues or questions, please open an issue on GitHub.
