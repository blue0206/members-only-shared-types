import { z } from 'zod';
import { Role } from '../enums/roles.enum.js';
import { GetMessagesResponseSchema } from './message.dto.js';
import { RegisterRequestSchema, UserSchema } from './auth.dto.js';

//----------------------------------GET USERS--------------------------------

// Response Schema
export const GetUsersResponseSchema = z.array(
    z
        .object({
            joinDate: z.union([z.date(), z.string().datetime()]),
            lastUpdate: z.union([z.date(), z.string().datetime()]),
            lastActive: z.union([z.date(), z.string().datetime()]),
        })
        .merge(UserSchema)
);
// Response DTO
export type GetUsersResponseDto = z.infer<typeof GetUsersResponseSchema>;

//--------------------------------EDIT USER--------------------------------

// Request Schema
export const EditUserRequestSchema = z
    .object({
        newUsername: RegisterRequestSchema.shape.username,
        newFirstname: RegisterRequestSchema.shape.firstname,
        newMiddlename: RegisterRequestSchema.shape.middlename,
        newLastname: RegisterRequestSchema.shape.lastname,
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

//--------------------------------SET ROLE--------------------------------

// Request Schema
export const SetRoleRequestQuerySchema = z.object({
    role: z.nativeEnum(Role),
});
// Request DTO
export type SetRoleRequestQueryDto = z.infer<typeof SetRoleRequestQuerySchema>;

//--------------------------------Upload Avatar------------------------------
// Response Schema
export const UploadAvatarResponseSchema = z.object({
    avatar: UserSchema.shape.avatar,
});
// Response DTO
export type UploadAvatarResponseDto = z.infer<typeof UploadAvatarResponseSchema>;

//--------PARAMS for SET ROLE, DELETE USER by username--------

// Request Params Schema
export const UsernameParamsSchema = z.object({
    username: RegisterRequestSchema.shape.username,
});
// Request Params DTO
export type UsernameParamsDto = z.infer<typeof UsernameParamsSchema>;

//--------------------------------GET BOOKMARKS------------------------------------------------

// Response Schema
export const GetUserBookmarksResponseSchema = z.array(
    z.object({
        ...GetMessagesResponseSchema.element.shape,
        bookmarked: z.boolean().refine((value) => value === true),
        messageTimestamp: z.union([z.date(), z.string().datetime()]), // Message timestamp.
        timestamp: z.union([z.date(), z.string().datetime()]), // Bookmark timestamp.
    })
);
// Response DTO
export type GetUserBookmarksResponseDto = z.infer<
    typeof GetUserBookmarksResponseSchema
>;
