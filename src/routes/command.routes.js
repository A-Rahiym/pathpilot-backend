import express from 'express';
import { processCommand, generateInstructions } from '../controllers/command.controller.js';

const router = express.Router();

// POST /api/command/process - Process voice command
router.post('/process', processCommand);

// POST /api/command/instructions - Generate turn-by-turn instructions
router.post('/instructions', generateInstructions);

export default router;
