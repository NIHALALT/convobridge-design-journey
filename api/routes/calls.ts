import express from 'express';
import { createCall, getCalls, getCall, getCallStats } from '../controllers/callController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.use(authenticateJWT);

router.post('/', createCall);
router.get('/', getCalls);
router.get('/stats', getCallStats);
router.get('/:id', getCall);

export default router;
