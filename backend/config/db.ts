import mongoose from 'mongoose';

// Serverless-friendly mongoose connection caching.
// Store the promise on globalThis so it persists across lambda invocations in the same container.
declare global {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	// allow attaching to globalThis in a controlled way
	var __mongooseConnectPromise: Promise<typeof mongoose> | undefined;
}

export const connectDB = async () => {
	const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

	if (!uri) {
		// Non-fatal: log a clear warning and return null so route handlers can continue and
		// choose how to respond (this prevents blowing up at import time).
		console.warn('⚠️ MONGODB_URI is not set in environment. Database operations will be disabled.');
		return null;
	}

	// If we already started connecting, reuse the promise
	if (global.__mongooseConnectPromise) {
		// Wait for the previously created connection promise to resolve and return the connection
		await global.__mongooseConnectPromise;
		return mongoose.connection;
	}

	// Create and cache the connect promise on globalThis to avoid reconnect storms
	global.__mongooseConnectPromise = (async () => {
		try {
			await mongoose.connect(uri, {} as mongoose.ConnectOptions);
			console.log('✅ Connected to MongoDB');
			return mongoose;
		} catch (err) {
			console.error('❌ MongoDB connection error:', err);
			// Clear cached promise so next invocation can retry
			global.__mongooseConnectPromise = undefined;
			throw err;
		}
	})();

	await global.__mongooseConnectPromise;
	return mongoose.connection;
};

export default connectDB;
