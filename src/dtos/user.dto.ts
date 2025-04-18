import { z } from 'zod';
import { Role } from '../enums/roles.enum.js';
import { GetMessagesResponseSchema } from './message.dto.js';
import { RegisterRequestSchema } from './auth.dto.js';

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

// GET MESSAGES
// Response Schema
export const GetUserMessagesResponseSchema = GetMessagesResponseSchema;
// Response DTO
export type GetUserMessagesResponseDto = z.infer<
    typeof GetUserMessagesResponseSchema
>;
// Note: Though the schema is same, the use case is different.
// In this case, the messages fetched only belong to the user unlike with
// the generic schema imported which is for all messages.
// This schema will be used in User route, for a clear separation of concerns,
// with the redeclaration of variable.

// EDIT USER
// Request Schema
export const EditUserRequestSchema = z
    .object({
        username: RegisterRequestSchema.shape.username,
        firstname: RegisterRequestSchema.shape.firstname,
        middlename: RegisterRequestSchema.shape.middlename,
        lastname: RegisterRequestSchema.shape.lastname,
        avatar: RegisterRequestSchema.shape.avatar,
    })
    .partial();
// Request DTO
export type EditUserRequestDto = z.infer<typeof EditUserRequestSchema>;
