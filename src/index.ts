// Export all auth zod-schemas.
export {
    RegisterRequestSchema,
    RegisterResponseSchema,
    LoginRequestSchema,
    LoginResponseSchema,
    RefreshResponseSchema,
    UserSchema,
} from './dtos/auth.dto.js';
// Export all auth DTOs.
export type {
    RegisterRequestDto,
    RegisterResponseDto,
    LoginRequestDto,
    LoginResponseDto,
    RefreshResponseDto,
    UserDto,
} from './dtos/auth.dto.js';

// Export all user zod-schemas.
export {
    EditUserRequestSchema,
    EditUserResponseSchema,
    GetUserMessagesResponseSchema,
    ResetPasswordRequestSchema,
    MemberRoleUpdateRequestSchema,
    SetRoleRequestQuerySchema,
    UsernameParamsSchema,
} from './dtos/user.dto.js';
// Export all user DTOs
export type {
    EditUserRequestDto,
    EditUserResponseDto,
    GetUserMessagesResponseDto,
    ResetPasswordRequestDto,
    MemberRoleUpdateRequestDto,
    SetRoleRequestQueryDto,
    UsernameParamsDto,
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
    GetUserBookmarksResponseSchema,
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
    GetUserBookmarksResponseDto,
} from './dtos/message.dto.js';

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

// Export enums.
export { Role } from './enums/roles.enum.js';
