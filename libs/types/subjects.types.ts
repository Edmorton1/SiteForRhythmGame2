import { z } from "zod";

const rolesZodSchema = z.enum(["user", "admin"]);

export type Role = z.infer<typeof rolesZodSchema>;

const zid = z.number().int();
const zISOString = z.coerce.date().transform(d => d.toISOString());

export const UserZodSchema = z.object({
	id: zid,
	role: rolesZodSchema,
	email: z.email().max(256).nullable(),
	provider_id: z.string().max(21).nullable(),
	// TODO: set min length more
	password: z.string().min(3).max(128).nullable(),
	banned: z.boolean().default(false),
});
type User = z.infer<typeof UserZodSchema>;

export const ProfileZodSchema = z.object({
	id: zid,
	name: z.string().max(32).nonempty(),
	// У Client и Server будут свои DTO's
	avatar: z.string().nullable(),
	about: z.string().max(512),
	country_code: z.string().length(2),
	created_at: zISOString,
});
type Profile = z.infer<typeof ProfileZodSchema>;

export interface Database {
	users: User;
	profile: Profile;
}
