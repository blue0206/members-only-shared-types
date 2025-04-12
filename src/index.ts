// Export all auth zod-schemas.
export {
  RegisterRequestSchema,
  RegisterResponseSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  RefreshResponseSchema,
} from "./dtos/auth.dto.js";

// Export all auth DTOs.
export type {
  RegisterRequestDto,
  RegisterResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  RefreshResponseDto,
} from "./dtos/auth.dto.js";

// Export all user zod-schemas.
export { UserSchema } from "./dtos/user.dto.js";

// Export all user DTOs
export type { UserDto } from "./dtos/user.dto.js";

// Export API Error and Response interfaces.
export type { ApiErrorPayload, ApiResponseError } from "./api/base.js";

// Export error codes and type.
export { ErrorCodes } from "./api/error-codes.js";
export type { ApiErrorCode } from "./api/error-codes.js";

// Export enums.
export { Role } from "./enums/roles.enum.js";
