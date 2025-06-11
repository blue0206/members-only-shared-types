import { z } from 'zod';
import { Role } from '../enums/roles.enum.js';
import { AvatarSchema } from './file.dto.js';

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

//--------------------------------REGISTER--------------------------------

// Request Schema
export const RegisterRequestSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, {
            message: 'A username is required.',
        })
        .regex(/^(?!.*\s)[a-zA-Z0-9_]+$/, {
            message: 'The username can only have letters, numbers, and underscores.',
        }),
    firstname: z
        .string()
        .trim()
        .regex(/^\p{L}+(-\p{L}+)*$/u, { message: 'The first name is invalid.' }),
    middlename: z
        .string()
        .trim()
        .regex(/^(\p{L}+(-\p{L}+)*)?$/u, { message: 'The middle name is invalid.' })
        .optional(),
    lastname: z
        .string()
        .trim()
        .regex(/^(\p{L}+(-\p{L}+)*)?$/u, { message: 'The last name is invalid.' })
        .optional(),
    password: z.string().superRefine((value, ctx) => {
        const requirements = [];
        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecialChars = /[@$!%*?&]/.test(value);

        if (value.length < 8) {
            requirements.push('• At least 8 characters');
        }
        if (!hasUppercase) {
            requirements.push('• At least 1 uppercase letter');
        }
        if (!hasLowercase) {
            requirements.push('• At least 1 lowercase letter');
        }
        if (!hasNumber) {
            requirements.push('• At least 1 number');
        }
        if (!hasSpecialChars) {
            requirements.push('• At least 1 special character');
        }

        if (requirements.length > 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `The password must contain:\n${requirements.join(`\n`)}`,
            });
        }
    }),
    avatar: AvatarSchema.nullish().optional(),
});
// Request DTO
export type RegisterRequestDto = z.infer<typeof RegisterRequestSchema>;

// Response Schema
export const RegisterResponseSchema = z
    .object({
        accessToken: z.string(),
    })
    .merge(UserSchema);
// Response DTO
export type RegisterResponseDto = z.infer<typeof RegisterResponseSchema>;

//--------------------------------LOGIN--------------------------------

// Register Schema
export const LoginRequestSchema = z.object({
    username: z.string().trim().min(1, { message: 'Please enter your username.' }),
    password: z.string().trim().min(1, { message: 'Please enter your password.' }),
});
// Register DTO
export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;

// Response Schema
export const LoginResponseSchema = RegisterResponseSchema; // Same as Registration Response
// Response DTO
export type LoginResponseDto = z.infer<typeof LoginResponseSchema>;

// No need for Logout Request/Response schema and Refresh Response schema as
// they only require headers, specifically, the cookie header carrying refreshToken.

//--------------------------------REFRESH--------------------------------

// Response Schema
export const RefreshResponseSchema = z.object({
    accessToken: z.string(),
});
// Response DTO
export type RefreshResponseDto = z.infer<typeof RefreshResponseSchema>;

//--------------------------------USER SESSIONS--------------------------------

// Response Schema
export const UserSessionsResponseSchema = z.array(
    z.object({
        sessionId: z.string().uuid(),
        userId: z.number(),
        userIp: z.string().ip().optional(),
        userAgent: z.string().optional(),
        userLocation: z.string().optional(),
        lastUsedOn: z.union([z.date(), z.string().datetime()]),
        expires: z.union([z.date(), z.string().datetime()]),
        currentSession: z.boolean(),
    })
);
export type UserSessionsResponseDto = z.infer<typeof UserSessionsResponseSchema>;
