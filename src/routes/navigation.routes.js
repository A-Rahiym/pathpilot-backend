import express from 'express';
import { getDirections } from '../controllers/navigationController.js';

const router = express.Router();

/**
 * @route   POST /api/navigation/directions
 * @desc    Get directions from origin to destination
 * @access  Public
 */
router.post('/directions', getDirections);

export default router;
