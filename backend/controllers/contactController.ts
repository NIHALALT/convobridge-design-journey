import { Request, Response, NextFunction } from 'express';
import { connectDB } from '../config/db.js';
import { Contact } from '../models/Contact.js';
import { AppError } from '../middleware/errorHandler.js';

export const createContact = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await connectDB();

		const { name, email, message, company } = req.body;
		if (!name || !email || !message) {
			throw new AppError(400, 'Name, email, and message are required');
		}

		const contact = new Contact({ name, email, message, company });
		await contact.save();

		// In a fuller implementation you'd optionally notify a mailbox or create a ticket.
		res.status(201).json({ success: true, contact: { id: contact._id, name: contact.name, email: contact.email, company: contact.company, message: contact.message, createdAt: contact.createdAt } });
	} catch (err) {
		next(err);
	}
};

export const listContacts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await connectDB();
		const items = await Contact.find().sort({ createdAt: -1 }).limit(100);
		res.json({ success: true, items });
	} catch (err) {
		next(err);
	}
};

export default { createContact, listContacts };
