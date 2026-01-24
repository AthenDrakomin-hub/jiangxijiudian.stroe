import mongoose from 'mongoose';

interface IPartner extends mongoose.Document {
  name: string;
  type: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  agreementStartDate?: Date;
  agreementEndDate?: Date;
  status: 'active' | 'inactive' | 'pending';
  commissionRate?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const partnerSchema = new mongoose.Schema<IPartner>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['delivery', 'marketing', 'technology', 'other']
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  agreementStartDate: {
    type: Date
  },
  agreementEndDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  commissionRate: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IPartner>('Partner', partnerSchema);