import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
	namespace Express {
		interface Request {
			userId?: string;
		}
	}
}

const JWT_SECRET = process.env.JWT_SECRET || 'changemeinprod';

export const generateToken = (userId: string) => {
	return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization || (req as any).cookies?.token;
	if (!authHeader) {
		return res.status(401).json({ success: false, message: 'No authorization token provided' });
	}

	const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as any;
		req.userId = decoded?.id;
		return next();
	} catch (err) {
		return res.status(401).json({ success: false, message: 'Invalid or expired token' });
	}
};

export default authenticateJWT;
