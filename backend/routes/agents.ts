import express from 'express';

const router = express.Router();

// Minimal placeholder routes for agents
router.get('/', (req, res) => res.json({ success: true, message: 'Agents root' }));

export default router;
