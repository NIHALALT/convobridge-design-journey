import express from 'express';
import { createAgent, getAgents, getAgent, updateAgent, deleteAgent } from '../controllers/agentController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.use(authenticateJWT);

router.post('/', createAgent);
router.get('/', getAgents);
router.get('/:id', getAgent);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);

export default router;
