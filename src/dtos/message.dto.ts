import { z } from 'zod';

// GET MESSAGES (Unregistered/User)
// Response Schema
export const GetMessagesWithoutAuthorResponseSchema = z.array(
    z.object({
        messageId: z.number(),
        message: z.string(),
        timestamp: z.date(),
    })
);
// Response DTO
export type GetMessagesWithoutAuthorResponseDto = z.infer<
    typeof GetMessagesWithoutAuthorResponseSchema
>;

// GET MESSAGES (Member/Admin)
// Response Schema
export const GetMessagesResponseSchema = z.array(
    z.object({
        messageId: z.number(),
        message: z.string(),
        username: z.string(),
        edited: z.boolean(),
        timestamp: z.date(),
    })
);
// Response DTO
export type GetMessagesResponseDto = z.infer<typeof GetMessagesResponseSchema>;

// CREATE MESSAGE
// Request Schema
export const CreateMessageRequestSchema = z.object({
    message: z
        .string()
        .min(1, { message: 'The message cannot be empty.' })
        .max(1100, { message: 'The message is too long.' }),
});
// Request DTO
export type CreateMessageRequestDto = z.infer<typeof CreateMessageRequestSchema>;
// Response Schema (can either be with or without author depending on role.)
export const CreateMessageResponseSchema = z.union([
    GetMessagesResponseSchema,
    GetMessagesWithoutAuthorResponseSchema,
]);
// Response DTO
export type CreateMessageResponseDto = z.infer<typeof CreateMessageResponseSchema>;

// EDIT MESSAGE
// Request Schema
export const EditMessageRequestSchema = z.object({
    newMessage: z
        .string()
        .min(1, { message: 'The message cannot be empty.' })
        .max(1100, { message: 'The message is too long.' }),
});
export const EditMessageRequestParamsSchema = z.object({
    messageId: z.number(),
});
// Request DTO
export type EditMessageRequestDto = z.infer<typeof EditMessageRequestSchema>;
export type EditMessageRequestParamsDto = z.infer<
    typeof EditMessageRequestParamsSchema
>;
// Response Schema (Only members and admin can edit their messages.)
export const EditMessageResponseSchema = GetMessagesResponseSchema;
// Response DTO
export type EditMessageResponseDto = z.infer<typeof EditMessageResponseSchema>;

// DELETE MESSAGE
// Request Schema
export const DeleteMessageRequestParamsSchema = z.object({
    messageId: z.number(),
});
// Request DTO
export type DeleteMessageRequestParamsDto = z.infer<
    typeof DeleteMessageRequestParamsSchema
>;
