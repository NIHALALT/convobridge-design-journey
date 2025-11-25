import express from 'express';
import { createContact, listContacts } from '../controllers/contactController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Public: submit a contact message
router.post('/', createContact);

// Protected: list recent contact messages (admin use)
router.get('/', authenticateJWT, listContacts);

export default router;
