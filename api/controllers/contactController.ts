import { Request, Response, NextFunction } from 'express';
import { Contact } from '../models/Contact';
import { AppError } from '../middleware/errorHandler';
import { connectDB } from '../config/db';

export const createContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();

    const { name, email, company, message } = req.body;

    if (!name || !email || !message) {
      throw new AppError(400, 'Name, email, and message are required');
    }

    const contact = new Contact({
      name,
      email,
      company,
      message,
    });

    await contact.save();

    // TODO: Send confirmation email

    res.status(201).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
      contact: {
        id: contact._id,
        email: contact.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();

    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const filter: any = {};
    if (status) filter.status = status;

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Contact.countDocuments(filter);

    res.json({
      success: true,
      contacts,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();

    const { status } = req.body;

    if (!['new', 'contacted', 'replied'].includes(status)) {
      throw new AppError(400, 'Invalid status');
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      throw new AppError(404, 'Contact not found');
    }

    res.json({
      success: true,
      contact,
    });
  } catch (error) {
    next(error);
  }
};
