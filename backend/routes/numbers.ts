import express from 'express';
import { listNumbers, createNumber, updateNumber, deleteNumber } from '../controllers/numberController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateJWT, listNumbers);
router.post('/', authenticateJWT, createNumber);
router.put('/:id', authenticateJWT, updateNumber);
router.delete('/:id', authenticateJWT, deleteNumber);

export default router;
