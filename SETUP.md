# PathPilot Backend - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd pathpilot-backend
npm install
```

### Step 2: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
nano .env  # or use any text editor
```

**Required API Keys:**
- **Google Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Google Maps API Key**: Get from [Google Cloud Console](https://console.cloud.google.com/)
  - Enable: Maps JavaScript API, Directions API, Places API, Geocoding API

### Step 3: Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
🚀 PathPilot backend running on port 5000
📍 Environment: development
🔑 Gemini API: Configured ✓
🗺️  Maps API: Configured ✓
```

### Step 4: Test API
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test intent parsing
curl -X POST http://localhost:5000/api/speech/parse-intent \
  -H "Content-Type: application/json" \
  -d '{"transcribedText": "Navigate to the pharmacy"}'
```

---

## 🧪 Testing with Postman

1. **Import Collection:**
   - Open Postman
   - Click "Import"
   - Select `PathPilot-API.postman_collection.json`

2. **Set Base URL:**
   - Collection variables → `base_url` = `http://localhost:5000`

3. **Test Endpoints:**
   - Start with "Health Check"
   - Try "Parse Intent" with different voice commands
   - Test image upload with "Analyze Obstacles"

---

## 📋 Common Issues

### "API key not configured"
- Check `.env` file exists
- Verify API keys are correct
- Restart server after changing `.env`

### "CORS error" from frontend
- Add frontend URL to `ALLOWED_ORIGINS` in `.env`
- Format: `http://localhost:3000,http://localhost:5173`

### Image upload fails
- Check file size (max 5MB)
- Verify file type (JPEG, PNG, WebP only)
- Ensure `Content-Type: multipart/form-data` header

---

## 🎯 Testing Each Feature

### 1. Voice Intent Parsing
```bash
curl -X POST http://localhost:5000/api/speech/parse-intent \
  -H "Content-Type: application/json" \
  -d '{
    "transcribedText": "Navigate to the nearest hospital"
  }'
```

**Expected:** `intent: "navigate"`, `destination: "nearest hospital"`

### 2. Get Current Location Address
```bash
curl "http://localhost:5000/api/location/reverse-geocode?lat=11.0822&lng=7.6667"
```

**Expected:** Address in Zaria, Nigeria area

### 3. Get Route to Destination
```bash
curl -X POST http://localhost:5000/api/navigation/directions \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"lat": 11.0822, "lng": 7.6667},
    "destination": "ABU Zaria",
    "mode": "walking"
  }'
```

**Expected:** Route with polyline, steps, distance, duration

### 4. Find Nearby Pharmacies
```bash
curl "http://localhost:5000/api/location/nearby?lat=11.0822&lng=7.6667&type=pharmacy&radius=2000"
```

**Expected:** Array of nearby pharmacy locations

### 5. Place Autocomplete
```bash
curl "http://localhost:5000/api/location/autocomplete?query=pharmacy&lat=11.0822&lng=7.6667"
```

**Expected:** List of pharmacy suggestions

### 6. Obstacle Detection (requires image file)
```bash
curl -X POST http://localhost:5000/api/camera/analyze-obstacles \
  -F "image=@test-image.jpg" \
  -F "context={\"navigating\":true}"
```

**Expected:** Obstacle analysis with directions and recommendations

---

## 🔄 Development Workflow

1. Make code changes in `src/`
2. Server auto-reloads (if using `npm run dev`)
3. Test endpoint in Postman or curl
4. Check server logs for errors
5. Iterate

---

## 📊 Server Logs

Logs show:
- Incoming requests
- API calls to Gemini/Maps
- Errors and stack traces
- Performance metrics

Enable detailed logging by setting `NODE_ENV=development`

---

## 🌐 Deployment Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Use environment variables (not hardcoded keys)
- [ ] Configure CORS for production domains
- [ ] Add rate limiting middleware
- [ ] Set up monitoring/logging
- [ ] Use HTTPS
- [ ] Add authentication if needed
- [ ] Test all endpoints
- [ ] Document API for frontend team

---

## 📚 Next Steps

1. **Integrate with Frontend:**
   - Share API base URL
   - Provide API documentation
   - Test end-to-end flows

2. **Add Features:**
   - User authentication
   - Request rate limiting
   - Caching for frequent requests
   - WebSocket for real-time updates

3. **Optimize:**
   - Image compression before Gemini API
   - Cache geocoding results
   - Batch similar requests

---

## 💡 Tips

- **Gemini API Rate Limits:** Be mindful of API quotas
- **Maps API Costs:** Monitor usage to avoid unexpected charges
- **Image Size:** Smaller images = faster analysis
- **Error Handling:** Always check response status codes
- **Testing:** Test with real voice commands and images

---

## 🆘 Need Help?

- Check API documentation in README.md
- Review error messages in server logs
- Test individual services (Gemini, Maps) separately
- Verify API keys have correct permissions

Good luck! 🚀
