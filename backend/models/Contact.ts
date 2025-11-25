import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
	name: string;
	email: string;
	company?: string;
	message: string;
	createdAt: Date;
}

const ContactSchema: Schema<IContact> = new Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true, lowercase: true },
		company: { type: String, trim: true },
		message: { type: String, required: true, trim: true },
	},
	{ timestamps: true }
);

export const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
