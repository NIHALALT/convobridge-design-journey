import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
	email: string;
	name: string;
	company?: string;
	password: string;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
	{
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		name: { type: String, required: true, trim: true },
		company: { type: String, trim: true },
		password: { type: String, required: true, select: false },
	},
	{ timestamps: true }
);

UserSchema.pre<IUser>('save', async function () {
	const user = this as IUser;
	if (!user.isModified('password')) return;
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(user.password, salt);
	user.password = hash;
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
	// `this.password` may be undefined if not selected; callers should request +password when needed
	// Cast to any to access the selected field at runtime
	const currentPassword = (this as any).password || this.password;
	if (!currentPassword) return false;
	return bcrypt.compare(candidatePassword, currentPassword);
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
