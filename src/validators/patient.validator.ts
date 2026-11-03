import { z } from 'zod';

export const createPatientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  age: z.coerce.number().int().min(0, 'Age must be a positive number'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  phone: z.string().min(5, 'Phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  condition: z.string().min(2, 'Condition is required'),
  doctorId: z.string().min(1, 'Assigned doctor is required'),
  notes: z.string().optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

export const patientQuerySchema = z.object({
  search: z.string().optional(),
  condition: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  doctorId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'name', 'age', 'condition']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

