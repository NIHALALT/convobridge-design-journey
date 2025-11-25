import express from 'express';

const router = express.Router();

// Minimal placeholder routes for calls
router.get('/', (req, res) => res.json({ success: true, message: 'Calls root' }));

export default router;
