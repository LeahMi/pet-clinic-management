import { z } from 'zod';

export const patientSchema = z.object({
  name: z.string().min(1, 'Name is required').regex(/^[A-Za-z\s]+$/, 'Name must contain letters only'),
  phone: z
    .string()
    .min(7, 'Phone number is too short')
    .max(15, 'Phone number is too long')
    .regex(/^[0-9+\s]+$/, 'Invalid phone number'),
  petName: z.string().min(1, 'Pet name is required').regex(/^[A-Za-z\s]+$/, 'Pet name must contain letters only'),
  dateOfBirth: z.string().min(1, 'Date of birth is required')
    .refine((val) => {
      const date = new Date(val);
      const now = new Date();
      date.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      return !isNaN(date.getTime()) && date <= now;
    }, 'Date of birth cannot be in the future'),
  petType: z.enum(['dog', 'cat', 'parrot']),
});

export type PatientInput = z.infer<typeof patientSchema>;
