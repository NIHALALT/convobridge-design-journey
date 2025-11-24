import { Request, Response, NextFunction } from 'express';
import { Call } from '../models/Call';
import { AppError } from '../middleware/errorHandler';
import { connectDB } from '../config/db';

export const createCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();

    const { agentId, agentName, phoneNumber, duration, outcome, transcript, transcriptSnippet } = req.body;

    if (!agentId || !phoneNumber || duration === undefined || !outcome) {
      throw new AppError(400, 'Missing required fields');
    }

    const call = new Call({
      userId: req.userId,
      agentId,
      agentName: agentName || 'Unknown Agent',
      phoneNumber,
      duration,
      outcome,
      transcript: transcript || '',
      transcriptSnippet: transcriptSnippet || '',
      status: 'completed',
    });

    await call.save();

    res.status(201).json({
      success: true,
      call,
    });
  } catch (error) {
    next(error);
  }
};

export const getCalls = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();

    const { agentId, status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const filter: any = { userId: req.userId };
    if (agentId) filter.agentId = agentId;
    if (status) filter.status = status;

    const calls = await Call.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Call.countDocuments(filter);

    res.json({
      success: true,
      calls,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();

    const call = await Call.findById(req.params.id);
    if (!call || call.userId !== req.userId) {
      throw new AppError(404, 'Call not found');
    }

    res.json({
      success: true,
      call,
    });
  } catch (error) {
    next(error);
  }
};

export const getCallStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();

    const calls = await Call.find({ userId: req.userId });

    const totalCalls = calls.length;
    const totalDuration = calls.reduce((sum, call) => sum + call.duration, 0);
    const completedCalls = calls.filter(c => c.status === 'completed').length;
    const completionRate = totalCalls > 0 ? (completedCalls / totalCalls) * 100 : 0;

    res.json({
      success: true,
      stats: {
        totalCalls,
        completedCalls,
        completionRate: completionRate.toFixed(1),
        totalDuration,
        avgDuration: totalCalls > 0 ? (totalDuration / totalCalls).toFixed(1) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
