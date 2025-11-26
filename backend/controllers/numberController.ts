import { Request, Response, NextFunction } from 'express';
import { connectDB } from '../config/db.js';
import { PhoneNumber } from '../models/PhoneNumber.js';
import { AppError } from '../middleware/errorHandler.js';

export const listNumbers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    const nums = await PhoneNumber.find().sort({ createdAt: -1 });
    res.json({ success: true, numbers: nums });
  } catch (err) {
    next(err);
  }
};

export const createNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    const { number, label, provider, available, metadata } = req.body;
    if (!number) throw new AppError(400, 'Number is required');
    const existing = await PhoneNumber.findOne({ number });
    if (existing) throw new AppError(409, 'Number already exists');
    const pn = await PhoneNumber.create({ number, label, provider, available: available ?? true, metadata });
    res.status(201).json({ success: true, number: pn });
  } catch (err) {
    next(err);
  }
};

export const updateNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    const { id } = req.params;
    const updates = req.body;
    const pn = await PhoneNumber.findByIdAndUpdate(id, updates, { new: true });
    if (!pn) throw new AppError(404, 'Number not found');
    res.json({ success: true, number: pn });
  } catch (err) {
    next(err);
  }
};

export const deleteNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    const { id } = req.params;
    const pn = await PhoneNumber.findByIdAndDelete(id);
    if (!pn) throw new AppError(404, 'Number not found');
    res.json({ success: true, message: 'Number deleted' });
  } catch (err) {
    next(err);
  }
};
