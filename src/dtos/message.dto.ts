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
    userId: z.number(),
});
// Request DTO
export type CreateMessageRequestDto = z.infer<typeof CreateMessageRequestSchema>;

// EDIT MESSAGE
// Request Schema
export const EditMessageRequestSchema = z.object({
    messageId: z.number(),
    newMessage: z
        .string()
        .min(1, { message: 'The message cannot be empty.' })
        .max(1100, { message: 'The message is too long.' }),
});
// Request DTO
export type EditMessageRequestDto = z.infer<typeof EditMessageRequestSchema>;

// DELETE MESSAGE
// Request Schema
export const DeleteMessageRequestSchema = z.object({
    messageId: z.number(),
});
// Request DTO
export type DeleteMessageRequestDto = z.infer<typeof DeleteMessageRequestSchema>;
