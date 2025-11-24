import mongoose, { Schema, Document } from 'mongoose';

export interface IAgent extends Document {
  userId: string;
  name: string;
  type: 'sales' | 'support' | 'scheduling' | 'custom';
  description: string;
  template: string;
  systemPrompt: string;
  voice: string;
  languages: string[];
  personality: number; // 0-100 scale
  isActive: boolean;
  phoneNumber?: string;
  integrations: {
    salesforce?: boolean;
    hubspot?: boolean;
    stripe?: boolean;
    zapier?: boolean;
  };
  settings: {
    timezone?: string;
    businessHours?: string;
    escalationEmail?: string;
  };
  stats: {
    totalCalls: number;
    successRate: number;
    avgDuration: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema = new Schema<IAgent>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Agent name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['sales', 'support', 'scheduling', 'custom'],
      required: true,
    },
    description: {
      type: String,
    },
    template: {
      type: String,
      required: true,
    },
    systemPrompt: {
      type: String,
      required: [true, 'System prompt is required'],
    },
    voice: {
      type: String,
      default: 'aria',
    },
    languages: [
      {
        type: String,
      },
    ],
    personality: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phoneNumber: {
      type: String,
    },
    integrations: {
      salesforce: { type: Boolean, default: false },
      hubspot: { type: Boolean, default: false },
      stripe: { type: Boolean, default: false },
      zapier: { type: Boolean, default: false },
    },
    settings: {
      timezone: String,
      businessHours: String,
      escalationEmail: String,
    },
    stats: {
      totalCalls: { type: Number, default: 0 },
      successRate: { type: Number, default: 0 },
      avgDuration: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

AgentSchema.index({ userId: 1, createdAt: -1 });

export const Agent = mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema);
