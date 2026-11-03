import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name cannot exceed 50 characters')
    .transform((val) => val.trim().toUpperCase()),
  description: z.string().max(255).optional(),
  permissions: z.array(z.string()).default([]),
});

export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name cannot exceed 50 characters')
    .transform((val) => val.trim().toUpperCase())
    .optional(),
  description: z.string().max(255).optional(),
  permissions: z.array(z.string()).optional(),
});

export const roleQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
