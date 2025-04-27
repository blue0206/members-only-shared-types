import { z } from 'zod';
import { Role } from '../enums/roles.enum.js';

// User Schema
export const UserSchema = z.object({
    id: z.number(),
    username: z.string(),
    firstname: z.string(),
    middlename: z.string().nullish(),
    lastname: z.string().nullish(),
    avatar: z.string().url().nullish(),
    role: z.nativeEnum(Role),
});
// User DTO
export type UserDto = z.infer<typeof UserSchema>;

// REGISTER REQUEST
// Schema
export const RegisterRequestSchema = z.object({
    username: z.string().regex(/^[a-zA-Z0-9_]+$/, {
        message: 'The username can only have letters, numbers, and underscores.',
    }),
    firstname: z
        .string()
        .regex(/^\p{L}+(-\p{L}+)*$/u, { message: 'The first name is invalid.' }),
    middlename: z
        .string()
        .regex(/^\p{L}+(-\p{L}+)*$/u, { message: 'The middle name is invalid.' })
        .optional(),
    lastname: z
        .string()
        .regex(/^\p{L}+(-\p{L}+)*$/u, { message: 'The last name is invalid.' })
        .optional(),
    password: z
        .string()
        .min(8, { message: 'The password must contain at least 8 characters.' })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message: `The password must contain:\n• At least 1 uppercase letter\n• At least 1 lowercase letter\n• At least 1 number\n• At least 1 special character (@$!%*?&)`,
            }
        ),
    avatar: z.string().url({ message: 'The avatar URL must be valid.' }).optional(),
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
    username: RegisterRequestSchema.shape.username,
    password: RegisterRequestSchema.shape.password,
});
// DTO
export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;

// LOGIN RESPONSE
// Schema
export const LoginResponseSchema = RegisterResponseSchema; // Same as Registration Response
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
