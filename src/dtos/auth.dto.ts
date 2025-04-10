import { z } from "zod";

// Registration Request Schema
export const RegisterRequestSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_]+$/),
  firstname: z.string().regex(/^[a-zA-Z]+$/),
  middlename: z
    .string()
    .regex(/^[a-zA-Z]+$/)
    .optional(),
  lastname: z
    .string()
    .regex(/^[a-zA-Z]+$/)
    .optional(),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    ),
  avatar: z.string().url().optional(),
});
// Registration Request DTO
export type RegisterRequestDTO = z.infer<typeof RegisterRequestSchema>;
