import app from './app.js';
import { APP_CONFIG } from './config/app.config.js';
import logger from './utils/logger.js';

const PORT = APP_CONFIG.PORT;

// Start server
const server = app.listen(PORT, () => {
  logger.info(`PathPilot backend running on port ${PORT}`, {
    environment: APP_CONFIG.NODE_ENV,
    port: PORT,
  });
  
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║                                           ║
  ║     🧭 PathPilot Backend Server           ║
  ║                                           ║
  ║     Environment: ${APP_CONFIG.NODE_ENV.padEnd(23)} ║
  ║     Port: ${PORT.toString().padEnd(31)} ║
  ║     Status: Running                       ║
  ║                                           ║
  ╚═══════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason,
    promise: promise,
  });
});

export default server;
