import express from 'express';
import { analyzeObstacles } from '../controllers/cameraController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

/**
 * @route   POST /api/camera/analyze-obstacles
 * @desc    Analyze camera image for obstacle detection
 * @access  Public
 */
router.post('/analyze-obstacles', upload.single('image'), analyzeObstacles);

export default router;
