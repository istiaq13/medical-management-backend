import { z } from 'zod';

export const createDoctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  specialization: z.string().min(2, 'Specialization is required'),
  hospital: z.string().min(2, 'Hospital is required'),
  phone: z.string().min(5, 'Valid phone number is required'),
  email: z.string().email('Valid email address is required'),
});

export const updateDoctorSchema = createDoctorSchema.partial();

export const doctorQuerySchema = z.object({
  search: z.string().optional(),
  specialization: z.string().optional(),
  hospital: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'name', 'specialization', 'hospital']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const addPatientUnderDoctorSchema = z.object({
  name: z.string().min(2, 'Patient name must be at least 2 characters'),
  age: z.coerce.number().int().min(0, 'Age must be positive'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  phone: z.string().min(5, 'Phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  condition: z.string().min(2, 'Medical condition is required'),
  notes: z.string().optional(),
});

