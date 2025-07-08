import { z } from 'zod';
import { EventReason } from '../enums/eventReason.enum.js';
import { SseEventNames, type SseEventNamesType } from '../api/event-names.js';
import { Role } from '../enums/roles.enum.js';

// Server Sent Event Interface
export interface ServerSentEvent<EventName extends SseEventNamesType, Payload> {
    event: EventName;
    data: Payload;
    id?: string;
}

//---------------------------------------Event Auth---------------------------------------

// Request Schema
export const EventRequestQuerySchema = z.object({
    accessToken: z.string().jwt(),
});
// Request DTO
export type EventRequestQueryDto = z.infer<typeof EventRequestQuerySchema>;

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

//---------------------------------------Event Request Dispatch (Lambda to EC2)---------------------------------------

// Request Schema
const eventNameDiscriminatedUnion = z.discriminatedUnion('eventName', [
    z.object({
        eventName: z.literal(SseEventNames.MESSAGE_EVENT),
        payload: MessageEventPayloadSchema,
    }),
    z.object({
        eventName: z.literal(SseEventNames.USER_EVENT),
        payload: UserEventPayloadSchema,
    }),
    z.object({
        eventName: z.literal(SseEventNames.MULTI_EVENT),
        payload: MultiEventPayloadSchema,
    }),
]);
const transmissionTypeDiscriminatedUnion = z.discriminatedUnion('transmissionType', [
    z.object({
        transmissionType: z.literal('unicast'),
        targetId: z.number(),
    }),
    z.object({
        transmissionType: z.literal('multicast'),
        targetRoles: z.array(z.nativeEnum(Role)),
    }),
    z.object({
        transmissionType: z.literal('broadcast'),
    }),
]);
export const EventRequestSchema = z.object({
    events: z.array(
        z.intersection(
            eventNameDiscriminatedUnion,
            transmissionTypeDiscriminatedUnion
        )
    ),
});
export type EventRequestDto = z.infer<typeof EventRequestSchema>;
