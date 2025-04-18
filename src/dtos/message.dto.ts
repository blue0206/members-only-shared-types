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
