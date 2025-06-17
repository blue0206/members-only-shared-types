import { z } from 'zod';

// Request Schema
export const EventRequestQuerySchema = z.object({
    accessToken: z.string().jwt(),
});
// Request DTO
export type EventRequestQueryDto = z.infer<typeof EventRequestQuerySchema>;
