import express from 'express';
import { createContact, getContacts, updateContactStatus } from '../controllers/contactController';

const router = express.Router();

// Public endpoint for contact form
router.post('/', createContact);

// Protected endpoints for admin/team
router.get('/', getContacts);
router.put('/:id', updateContactStatus);

export default router;
