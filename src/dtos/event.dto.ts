import { z } from 'zod';
import type { SseEventNamesType } from '../api/event-names.js';

// Request Schema
export const EventRequestQuerySchema = z.object({
    accessToken: z.string().jwt(),
});
// Request DTO
export type EventRequestQueryDto = z.infer<typeof EventRequestQuerySchema>;

// Server Sent Event Interface
export interface ServerSentEvent<EventName extends SseEventNamesType, Payload> {
    event: EventName;
    data: Payload;
    id?: string;
}
