import { Request, Response, NextFunction } from 'express';
import { Agent } from '../models/Agent';
import { AppError } from '../middleware/errorHandler';
import { connectDB } from '../config/db';

export const createAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();

    const { name, type, template, systemPrompt, voice, languages, personality, integrations } = req.body;

    if (!name || !type || !template || !systemPrompt) {
      throw new AppError(400, 'Missing required fields: name, type, template, systemPrompt');
    }

    const agent = new Agent({
      userId: req.userId,
      name,
      type,
      template,
      systemPrompt,
      voice: voice || 'aria',
      languages: languages || ['English'],
      personality: personality || 50,
      integrations: integrations || {},
    });

    await agent.save();

    res.status(201).json({
      success: true,
      agent,
    });
  } catch (error) {
    next(error);
  }
};

export const getAgents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();

    const agents = await Agent.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      agents,
    });
  } catch (error) {
    next(error);
  }
};

export const getAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();

    const agent = await Agent.findById(req.params.id);
    if (!agent || agent.userId !== req.userId) {
      throw new AppError(404, 'Agent not found');
    }

    res.json({
      success: true,
      agent,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();

    const agent = await Agent.findById(req.params.id);
    if (!agent || agent.userId !== req.userId) {
      throw new AppError(404, 'Agent not found');
    }

    Object.assign(agent, req.body);
    await agent.save();

    res.json({
      success: true,
      agent,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();

    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent || agent.userId !== req.userId) {
      throw new AppError(404, 'Agent not found');
    }

    res.json({
      success: true,
      message: 'Agent deleted',
    });
  } catch (error) {
    next(error);
  }
};
