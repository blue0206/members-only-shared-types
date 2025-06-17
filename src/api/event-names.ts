export const SseEventNames = {
    MESSAGE_EVENT: 'MESSAGE_EVENT',
    USER_EVENT: 'USER_EVENT',
    MULTI_EVENT: 'MULTI_EVENT',
} as const;

export type SseEventNamesType = (typeof SseEventNames)[keyof typeof SseEventNames];
