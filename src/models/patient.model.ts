import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  email?: string;
  condition: string;
  doctorId: Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age cannot be negative'],
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      required: [true, 'Gender is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    condition: {
      type: String,
      required: [true, 'Medical condition is required'],
      trim: true,
      index: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Assigned doctor is required'],
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching, filtering, and foreign key traversal
patientSchema.index({ name: 'text', phone: 'text', email: 'text' });
patientSchema.index({ doctorId: 1, createdAt: -1 });
patientSchema.index({ createdAt: -1 });

export const Patient: Model<IPatient> = mongoose.model<IPatient>('Patient', patientSchema);

