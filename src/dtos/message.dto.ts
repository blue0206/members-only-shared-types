import { z } from 'zod';
import { UserSchema } from './auth.dto.js';

//--------------------------------GET MESSAGES (Unregistered/User)--------------------------------

// Response Schema
export const GetMessagesWithoutAuthorResponseSchema = z.array(
    z.object({
        messageId: z.number(),
        message: z.string(),
        likes: z.number(),
        bookmarks: z.number(),
        userId: z.number().nullish(),
        timestamp: z.union([z.date(), z.string().datetime()]),
    })
);
// Response DTO
export type GetMessagesWithoutAuthorResponseDto = z.infer<
    typeof GetMessagesWithoutAuthorResponseSchema
>;

//--------------------------------GET MESSAGES (Member/Admin)--------------------------------

// Response Schema
export const GetMessagesResponseSchema = z.array(
    z.object({
        messageId: z.number(),
        message: z.string(),
        user: UserSchema.nullish(),
        likes: z.number(),
        bookmarks: z.number(),
        edited: z.boolean(),
        bookmarked: z.boolean(),
        liked: z.boolean(),
        timestamp: z.union([z.date(), z.string().datetime()]),
    })
);
// Response DTO
export type GetMessagesResponseDto = z.infer<typeof GetMessagesResponseSchema>;

//--------------------------------CREATE MESSAGE--------------------------------

// Request Schema
export const CreateMessageRequestSchema = z.object({
    message: z
        .string()
        .trim()
        .min(1, { message: 'The message cannot be empty.' })
        .max(2000, { message: 'The message is too long.' }),
});
// Request DTO
export type CreateMessageRequestDto = z.infer<typeof CreateMessageRequestSchema>;

// Response Schema (can either be with or without author depending on role.)
export const CreateMessageResponseSchema = z.union([
    GetMessagesResponseSchema.element,
    GetMessagesWithoutAuthorResponseSchema.element,
]);
// Response DTO
export type CreateMessageResponseDto = z.infer<typeof CreateMessageResponseSchema>;

//--------------------------------EDIT MESSAGE--------------------------------

// Request Schema
export const EditMessageRequestSchema = z.object({
    newMessage: z
        .string()
        .trim()
        .min(1, { message: 'The message cannot be empty.' })
        .max(2000, { message: 'The message is too long.' }),
});
// Request DTO
export type EditMessageRequestDto = z.infer<typeof EditMessageRequestSchema>;

// Response Schema (Only members and admin can edit their messages.)
export const EditMessageResponseSchema = GetMessagesResponseSchema.element;
// Response DTO
export type EditMessageResponseDto = z.infer<typeof EditMessageResponseSchema>;

//--------------------------------EDIT MESSAGE, DELETE MESSAGE--------------------------------

// Request Params Schema
export const MessageParamsSchema = z.object({
    messageId: z.coerce.number(),
});
// Request Params DTO
export type MessageParamsDto = z.infer<typeof MessageParamsSchema>;
