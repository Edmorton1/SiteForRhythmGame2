import { z } from "zod";

const rolesZodSchema = z.enum(["user", "admin"]);

export const UserZodSchema = z.object({
	id: z.number().int(),
	role: rolesZodSchema,
	email: z.email().max(256).nullable(),
	provider_id: z.string().max(21).nullable(),
	password: z.string().max(128).nullable(),
	banned: z.boolean().default(false),
});
export type User = z.infer<typeof UserZodSchema>;

// interface db {
// 	id: number,
// 	role:
// }

export interface Database {
	users: User;
}
