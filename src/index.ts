// Export all auth zod-schemas.
export {
    RegisterRequestSchema,
    RegisterResponseSchema,
    LoginRequestSchema,
    LoginResponseSchema,
    RefreshResponseSchema,
    UserSchema,
    UserSessionsResponseSchema,
    SessionIdParamsSchema,
} from './dtos/auth.dto.js';
// Export all auth DTOs.
export type {
    RegisterRequestDto,
    RegisterResponseDto,
    LoginRequestDto,
    LoginResponseDto,
    RefreshResponseDto,
    UserDto,
    UserSessionsResponseDto,
    SessionIdParamsDto,
} from './dtos/auth.dto.js';

// Export all user zod-schemas.
export {
    EditUserRequestSchema,
    EditUserResponseSchema,
    GetUsersResponseSchema,
    ResetPasswordRequestSchema,
    MemberRoleUpdateRequestSchema,
    SetRoleRequestQuerySchema,
    UsernameParamsSchema,
    GetUserBookmarksResponseSchema,
    UploadAvatarResponseSchema,
} from './dtos/user.dto.js';
// Export all user DTOs
export type {
    EditUserRequestDto,
    EditUserResponseDto,
    GetUsersResponseDto,
    ResetPasswordRequestDto,
    MemberRoleUpdateRequestDto,
    SetRoleRequestQueryDto,
    UsernameParamsDto,
    GetUserBookmarksResponseDto,
    UploadAvatarResponseDto,
} from './dtos/user.dto.js';

// Export all message zod-schemas.
export {
    CreateMessageRequestSchema,
    CreateMessageResponseSchema,
    GetMessagesWithoutAuthorResponseSchema,
    GetMessagesResponseSchema,
    EditMessageRequestSchema,
    EditMessageResponseSchema,
    MessageParamsSchema,
} from './dtos/message.dto.js';
// Export all message DTOs.
export type {
    CreateMessageRequestDto,
    CreateMessageResponseDto,
    GetMessagesWithoutAuthorResponseDto,
    GetMessagesResponseDto,
    EditMessageRequestDto,
    EditMessageResponseDto,
    MessageParamsDto,
} from './dtos/message.dto.js';

// Export all server-sent event zod schemas.
export {
    EventRequestQuerySchema,
    UserEventPayloadSchema,
    MessageEventPayloadSchema,
    MultiEventPayloadSchema,
} from './dtos/event.dto.js';
// Export all server-sent event DTOs/types.
export type {
    ServerSentEvent,
    EventRequestQueryDto,
    UserEventPayloadDto,
    MessageEventPayloadDto,
    MultiEventPayloadDto,
} from './dtos/event.dto.js';

// Export all file zod-schemas and other constants.
export { AvatarSchema, supportedImageFormats } from './dtos/file.dto.js';
// Export all file types.
export type { AvatarType, SupportedImageFormatsType } from './dtos/file.dto.js';

// Export API Error and Response interfaces.
export type {
    ApiErrorPayload,
    ApiResponseError,
    ApiResponseSuccess,
    ApiResponse,
} from './api/base.js';

// Export error codes and type.
export { ErrorCodes } from './api/error-codes.js';
export type { ApiErrorCode } from './api/error-codes.js';

// Export server-sent event names and type.
export { SseEventNames } from './api/event-names.js';
export type { SseEventNamesType } from './api/event-names.js';

// Export enums.
export { Role } from './enums/roles.enum.js';
export { EventReason } from './enums/eventReason.enum.js';
