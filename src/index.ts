// Export all auth zod-schemas.
export {
    RegisterRequestSchema,
    RegisterResponseSchema,
    LoginRequestSchema,
    LoginResponseSchema,
    RefreshResponseSchema,
} from './dtos/auth.dto.js';
// Export all auth DTOs.
export type {
    RegisterRequestDto,
    RegisterResponseDto,
    LoginRequestDto,
    LoginResponseDto,
    RefreshResponseDto,
} from './dtos/auth.dto.js';

// Export all user zod-schemas.
export {
    UserSchema,
    EditUserRequestSchema,
    EditUserResponseSchema,
    DeleteUserRequestParamsSchema,
    RoleUpdateRequestParamsSchema,
    GetUserMessagesResponseSchema,
    ResetPasswordRequestSchema,
    RoleUpdateResponseSchema,
} from './dtos/user.dto.js';
// Export all user DTOs
export type {
    UserDto,
    EditUserRequestDto,
    EditUserResponseDto,
    DeleteUserRequestParamsDto,
    RoleUpdateRequestParamsDto,
    GetUserMessagesResponseDto,
    ResetPasswordRequestDto,
    RoleUpdateResponseDto,
} from './dtos/user.dto.js';

// Export all message zod-schemas.
export {
    CreateMessageRequestSchema,
    GetMessagesWithoutAuthorResponseSchema,
    GetMessagesResponseSchema,
    EditMessageRequestSchema,
    DeleteMessageRequestSchema,
} from './dtos/message.dto.js';
// Export all message DTOs.
export type {
    CreateMessageRequestDto,
    GetMessagesWithoutAuthorResponseDto,
    GetMessagesResponseDto,
    EditMessageRequestDto,
    DeleteMessageRequestDto,
} from './dtos/message.dto.js';

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
