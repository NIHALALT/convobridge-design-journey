import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
	const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
	if (!uri) {
		throw new Error('MONGODB_URI is not set in environment');
	}

	if (isConnected || mongoose.connection.readyState === 1) {
		return mongoose.connection;
	}

	try {
		await mongoose.connect(uri, {
			// useNewUrlParser and useUnifiedTopology are defaults in mongoose v6+
		} as mongoose.ConnectOptions);
		isConnected = true;
		console.log('✅ Connected to MongoDB');
		return mongoose.connection;
	} catch (err) {
		console.error('❌ MongoDB connection error:', err);
		throw err;
	}
};

export default connectDB;
