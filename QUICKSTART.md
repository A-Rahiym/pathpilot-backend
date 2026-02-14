# PathPilot Backend - Quick Start Guide

## 🎯 What Changed?

Your monolithic `server.js` has been restructured into a clean, maintainable architecture:

**Before:**
```
server.js (270 lines - everything in one file)
```

**After:**
```
src/
├── app.js                          # Main entry (30 lines)
├── controllers/                    # Request handlers
│   ├── command.controller.js       # Command logic
│   └── navigation.controller.js    # Navigation logic
├── routes/                         # Route definitions
│   ├── command.routes.js           # /api/command/*
│   └── navigation.routes.js        # /api/navigation/*
├── services/                       # External API integrations
│   ├── gemini.service.js           # Gemini AI calls
│   └── maps.service.js             # Google Maps calls
└── middleware/
    └── errorHandler.js             # Global error handling
```

## 📊 API Routes Mapping

### Old → New

| Old Route | New Route |
|-----------|-----------|
| `POST /api/process-command` | `POST /api/command/process` |
| `POST /api/get-routes` | `POST /api/navigation/routes` |
| `POST /api/generate-instructions` | `POST /api/command/instructions` |
| `POST /api/geocode` | `POST /api/navigation/geocode` |

## 🚀 Setup Steps

1. **Navigate to project:**
```bash
cd pathpilot-backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment:**
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. **Run development server:**
```bash
npm run dev
```

## 🧪 Test with Postman

1. Import `PathPilot_API.postman_collection.json` into Postman
2. The collection includes all endpoints ready to test
3. Base URL is set to `http://localhost:5000`

### Quick Test Examples:

**1. Health Check:**
```bash
curl http://localhost:5000/health
```

**2. Process Command:**
```bash
curl -X POST http://localhost:5000/api/command/process \
  -H "Content-Type: application/json" \
  -d '{"text": "Navigate to the hospital"}'
```

**3. Get Routes:**
```bash
curl -X POST http://localhost:5000/api/navigation/routes \
  -H "Content-Type: application/json" \
  -d '{"origin": "New York", "destination": "Boston"}'
```

## 📁 File Responsibilities

### Controllers
Handle HTTP requests, validate input, call services, return responses.
- ✅ Thin layer between routes and services
- ✅ No business logic
- ✅ Just request/response handling

### Services
Contain business logic and external API calls.
- ✅ Reusable across controllers
- ✅ Testable independently
- ✅ Single responsibility

### Routes
Define API endpoints and link to controllers.
- ✅ Clean, declarative
- ✅ Easy to see all endpoints
- ✅ Simple to add new routes

## 🔄 How to Add New Features

### Example: Add "Search Places" endpoint

**1. Add service method** (`services/maps.service.js`):
```javascript
async searchPlaces(query, location) {
  // Call Google Places API
  return results;
}
```

**2. Add controller** (`controllers/navigation.controller.js`):
```javascript
export const searchPlaces = async (req, res, next) => {
  try {
    const { query, location } = req.body;
    const results = await mapsService.searchPlaces(query, location);
    res.json({ success: true, results });
  } catch (error) {
    next(error);
  }
};
```

**3. Add route** (`routes/navigation.routes.js`):
```javascript
import { searchPlaces } from '../controllers/navigation.controller.js';
router.post('/search', searchPlaces);
```

Done! Endpoint available at `POST /api/navigation/search`

## 🎨 Benefits of This Structure

1. **Separation of Concerns**: Each file has one job
2. **Easy Testing**: Services can be tested without Express
3. **Scalability**: Add features without touching other code
4. **Maintainability**: Find and fix issues faster
5. **Team-Friendly**: Multiple developers can work simultaneously

## 🔍 Debugging Tips

**See all logs:**
```bash
npm run dev
# Nodemon will auto-reload on file changes
```

**Test specific endpoint:**
```bash
# Use Postman collection or curl
curl -X POST http://localhost:5000/api/command/process \
  -H "Content-Type: application/json" \
  -d '{"text": "test command"}'
```

**Check errors:**
- All errors logged to console
- In development: Full stack trace returned
- In production: Generic error message

## 📦 Dependencies

Core packages (already in package.json):
- `express` - Web framework
- `@google/generative-ai` - Gemini AI SDK
- `axios` - HTTP client for Google Maps
- `cors` - Enable CORS
- `dotenv` - Environment variables

Dev dependency:
- `nodemon` - Auto-reload on changes

## ⚡ Performance Notes

- Services are singletons (one instance)
- No database calls (stateless API)
- Async/await for all I/O operations
- Error handling prevents crashes

## 🔐 Security Checklist

- ✅ API keys in .env (not committed)
- ✅ CORS enabled (configure for production)
- ✅ Input validation on all endpoints
- ✅ Error messages don't leak sensitive data
- 🔲 Add rate limiting (for production)
- 🔲 Add authentication (if needed)

## 🚦 Next Steps

1. Add more endpoints based on frontend needs
2. Add input validation middleware
3. Add request logging
4. Add unit tests
5. Set up CI/CD pipeline

---

**Need help?** Check README.md for detailed API documentation.
