import { z } from 'zod';
import { EventReason } from '../enums/eventReason.enum.js';
import type { SseEventNamesType } from '../api/event-names.js';
import { Role } from '../enums/roles.enum.js';

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
    originId: z.number(),
});
// Event Payload DTO
export type UserEventPayloadDto = z.infer<typeof UserEventPayloadSchema>;

//---------------------------------------MESSAGE_EVENT---------------------------------------

// Event Payload Schema
export const MessageEventPayloadSchema = z.object({
    reason: z.nativeEnum(EventReason),
    originId: z.number(),
});
// Event Payload DTO
export type MessageEventPayloadDto = z.infer<typeof MessageEventPayloadSchema>;

//---------------------------------------MESSAGE_AND_USER_EVENT---------------------------------------

// Event Payload Schema
export const MultiEventPayloadSchema = z.object({
    reason: z.nativeEnum(EventReason),
    originId: z.number(), // ID of client who instigated the action.
    originUsername: z.string().optional(),
    targetId: z.number().optional(), // Username of client who is affected by the action (used to display new member toast.)
    targetUserRole: z.nativeEnum(Role).optional(),
});
// Event Payload DTO
export type MultiEventPayloadDto = z.infer<typeof MultiEventPayloadSchema>;
