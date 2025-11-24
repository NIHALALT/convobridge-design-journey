import mongoose, { Schema, Document } from 'mongoose';

export interface ICall extends Document {
  userId: string;
  agentId: string;
  agentName: string;
  phoneNumber: string;
  duration: number; // in seconds
  status: 'completed' | 'missed' | 'in-progress' | 'failed';
  outcome: string;
  transcript: string;
  recordingUrl?: string;
  transcriptSnippet: string;
  metadata: {
    caller_name?: string;
    caller_email?: string;
    sentiment?: string;
    callType?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CallSchema = new Schema<ICall>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    agentId: {
      type: String,
      required: [true, 'Agent ID is required'],
      index: true,
    },
    agentName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    duration: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['completed', 'missed', 'in-progress', 'failed'],
      default: 'completed',
    },
    outcome: {
      type: String,
      required: true,
    },
    transcript: {
      type: String,
      default: '',
    },
    recordingUrl: {
      type: String,
    },
    transcriptSnippet: {
      type: String,
      default: '',
    },
    metadata: {
      caller_name: String,
      caller_email: String,
      sentiment: String,
      callType: String,
    },
  },
  { timestamps: true }
);

CallSchema.index({ userId: 1, createdAt: -1 });
CallSchema.index({ agentId: 1, createdAt: -1 });

export const Call = mongoose.models.Call || mongoose.model<ICall>('Call', CallSchema);
