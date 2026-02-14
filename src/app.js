import express from 'express';
import cors from 'cors';
import config from './config/config.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import routes
import speechRoutes from './routes/speech.routes.js';
import cameraRoutes from './routes/camera.routes.js';
import navigationRoutes from './routes/navigation.routes.js';
import locationRoutes from './routes/location.routes.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'PathPilot backend is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/speech', speechRoutes);
app.use('/api/camera', cameraRoutes);
app.use('/api/navigation', navigationRoutes);
app.use('/api/location', locationRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 PathPilot backend running on port ${config.port}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
  console.log(`🔑 Gemini API: ${config.geminiApiKey ? 'Configured ✓' : 'Missing ✗'}`);
  console.log(`🗺️  Maps API: ${config.mapsApiKey ? 'Configured ✓' : 'Missing ✗'}`);
});

export default app;
