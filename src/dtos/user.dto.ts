import { z } from 'zod';
import { Role } from '../enums/roles.enum.js';
import {
    GetMessagesResponseSchema,
    GetMessagesWithoutAuthorResponseSchema,
} from './message.dto.js';
import { RegisterRequestSchema, UserSchema } from './auth.dto.js';
import { AvatarSchema } from './file.dto.js';

//----------------------------------GET MESSAGES--------------------------------

// Response Schema
export const GetUserMessagesResponseSchema = z.union([
    GetMessagesResponseSchema,
    GetMessagesWithoutAuthorResponseSchema,
]);
// Response DTO
export type GetUserMessagesResponseDto = z.infer<
    typeof GetUserMessagesResponseSchema
>;

//--------------------------------EDIT USER--------------------------------

// Request Schema
export const EditUserRequestSchema = z
    .object({
        newUsername: RegisterRequestSchema.shape.username,
        newFirstname: RegisterRequestSchema.shape.firstname,
        newMiddlename: RegisterRequestSchema.shape.middlename,
        newLastname: RegisterRequestSchema.shape.lastname,
        newAvatar: AvatarSchema.optional(),
        // An indicator; if avatar is present, this indicator is provided, else not.
        // This does not determine with boolean, but instead with its presence.
        avatarPresent: z.boolean().optional(),
    })
    .partial()
    .refine(
        (data) => {
            return Object.values(data).some((value) => value !== undefined);
        },
        { message: 'At least one field is required.' }
    );
// Request DTO
export type EditUserRequestDto = z.infer<typeof EditUserRequestSchema>;

// Response Schema
export const EditUserResponseSchema = UserSchema;
// Response DTO
export type EditUserResponseDto = z.infer<typeof EditUserResponseSchema>;

//--------------------------------RESET PASSWORD--------------------------------

// Request Schema
export const ResetPasswordRequestSchema = z.object({
    oldPassword: RegisterRequestSchema.shape.password,
    newPassword: RegisterRequestSchema.shape.password,
});
// Request DTO
export type ResetPasswordRequestDto = z.infer<typeof ResetPasswordRequestSchema>;

//--------------------------------MEMBER ROLE UPDATE--------------------------------

// Request Schema
export const MemberRoleUpdateRequestSchema = z.object({
    secretKey: z.string(),
});
// Request DTO
export type MemberRoleUpdateRequestDto = z.infer<
    typeof MemberRoleUpdateRequestSchema
>;

// Response Schema
export const MemberRoleUpdateResponseSchema = UserSchema.pick({
    role: true,
});
// Response DTO
export type MemberRoleUpdateResponseDto = z.infer<
    typeof MemberRoleUpdateResponseSchema
>;

//--------------------------------SET ROLE--------------------------------

// Request Schema
export const SetRoleRequestQuerySchema = z.object({
    role: z.nativeEnum(Role),
});
// Request DTO
export type SetRoleRequestQueryDto = z.infer<typeof SetRoleRequestQuerySchema>;

//--------PARAMS for DELETE AVATAR, SET ROLE, DELETE USER by username--------

// Request Params Schema
export const UsernameParamsSchema = z.object({
    username: RegisterRequestSchema.shape.username,
});
// Request Params DTO
export type UsernameParamsDto = z.infer<typeof UsernameParamsSchema>;
