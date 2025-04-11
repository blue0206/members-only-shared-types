import { z } from "zod";
import { Role } from "../enums/roles.enum.js";

// User Schema
export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstname: z.string(),
  middlename: z.string().nullish(),
  lastname: z.string().nullish(),
  avatar: z.string().url().nullish(),
  role: z.nativeEnum(Role),
});
// User DTO
export type UserDto = z.infer<typeof UserSchema>;
