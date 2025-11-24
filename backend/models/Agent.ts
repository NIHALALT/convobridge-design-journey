import { Schema, model } from 'mongoose';

const agentSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  systemPrompt: {
    type: String,
    required: [true, 'System prompt is required'],
  },
  generatedContext: {
    type: String,
    default: '',
  },
  voice: {
    type: String,
    default: 'aria',
  },
  avatar: {
    type: String,
    default: '',
  },
});

export const Agent = model('Agent', agentSchema);
