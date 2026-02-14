import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Google API Keys
  geminiApiKey: 'AIzaSyByCJS4SOwM19p41WL9WNBUp2tbs8Z_4tY',
  mapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  
  // CORS
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://localhost:5173'],
  
  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
};

export default config;
