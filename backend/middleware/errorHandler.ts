import { NextFunction, Request, Response } from 'express';

export class AppError extends Error {
	statusCode: number;
	isOperational: boolean;

	constructor(statusCode: number, message: string, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		Error.captureStackTrace(this, this.constructor);
	}
}

export const errorHandler = (
	err: any,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	const statusCode = err?.statusCode || err?.status || 500;
	const message = err?.message || 'Internal Server Error';

	// In development, include stack trace
	const payload: any = { success: false, message };
	if (process.env.NODE_ENV !== 'production') {
		payload.stack = err?.stack;
		payload.error = err;
	}

	// Log server errors
	if (statusCode >= 500) {
		console.error('Server Error:', err);
	}

	res.status(statusCode).json(payload);
};

export default errorHandler;
