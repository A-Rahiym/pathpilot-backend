import express from 'express';
import { parseIntent } from '../controllers/speechController.js';

const router = express.Router();

/**
 * @route   POST /api/speech/parse-intent
 * @desc    Parse voice command to extract navigation intent
 * @access  Public
 */
router.post('/parse-intent', parseIntent);

export default router;
