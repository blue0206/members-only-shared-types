import { z } from "zod";
import { UserSchema } from "./user.dto.js";

// REGISTER REQUEST
// Schema
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
// DTO
export type RegisterRequestDto = z.infer<typeof RegisterRequestSchema>;

// REGISTER RESPONSE
// Schema
export const RegisterResponseSchema = z
  .object({
    accessToken: z.string(),
  })
  .merge(UserSchema);
// DTO
export type RegisterResponseDto = z.infer<typeof RegisterResponseSchema>;

// LOGIN REQUEST
// Schema
export const LoginRequestSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_]+$/),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    ),
});
// DTO
export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;

// LOGIN RESPONSE
// Schema
export const LoginResponseSchema = z
  .object({
    accessToken: z.string(),
  })
  .merge(UserSchema);
// DTO
export type LoginResponseDto = z.infer<typeof LoginResponseSchema>;

// No need for Logout Request/Response schema and Refresh Response schema as
// they only require headers, specifically, the cookie header carrying refreshToken.

// REFRESH RESPONSE
// Schema
export const RefreshResponseSchema = z.object({
  accessToken: z.string(),
});
// DTO
export type RefreshResponseDto = z.infer<typeof RefreshResponseSchema>;
