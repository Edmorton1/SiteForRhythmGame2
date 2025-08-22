import { z } from "zod";
import { zid } from "../enums/zod";

export const rolesZodSchema = z.enum(["user", "admin"]);
export type Role = z.infer<typeof rolesZodSchema>;

export const UserZodSchema = z.object({
	id: zid,
	role: rolesZodSchema,
	email: z.email().max(256).nullable(),
	provider_id: z.string().max(21).nullable(),
	// TODO: set min length more
	password: z.string().min(3).max(128).nullable(),
	banned: z.boolean().default(false),
});
export type User = z.infer<typeof UserZodSchema>;

export const UserDTOZodSchema = UserZodSchema.pick({
	email: true,
	password: true,
});
export type UserDTO = z.infer<typeof UserDTOZodSchema>;
