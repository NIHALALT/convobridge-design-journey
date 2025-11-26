import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoneNumber extends Document {
  number: string;
  label?: string;
  provider?: string;
  available: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PhoneNumberSchema: Schema = new Schema(
  {
    number: { type: String, required: true, unique: true },
    label: { type: String },
    provider: { type: String },
    available: { type: Boolean, default: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const PhoneNumber = mongoose.model<IPhoneNumber>('PhoneNumber', PhoneNumberSchema);
