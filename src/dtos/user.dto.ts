import { z } from "zod";
import { Role } from "../enums/roles.enum.js";

// User Schema
export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstname: z.string(),
  middlename: z.string().optional(),
  lastname: z.string().optional(),
  avatar: z.string().url().optional(),
  role: z.nativeEnum(Role),
});
// User DTO
export type UserDto = z.infer<typeof UserSchema>;
