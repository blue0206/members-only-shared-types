import { z } from 'zod';
import { EventReason } from '../enums/eventReason.enum.js';
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

//---------------------------------------USER_EVENT---------------------------------------

// Event Payload Schema
export const UserEventPayloadSchema = z.object({
    reason: z.nativeEnum(EventReason),
    userId: z.number(),
});
// Event Payload DTO
export type UserEventPayloadDto = z.infer<typeof UserEventPayloadSchema>;

//---------------------------------------MESSAGE_EVENT---------------------------------------

// Event Payload Schema
export const MessageEventPayloadSchema = z.object({
    reason: z.nativeEnum(EventReason),
    messageId: z.number(),
});
// Event Payload DTO
export type MessageEventPayloadDto = z.infer<typeof MessageEventPayloadSchema>;
