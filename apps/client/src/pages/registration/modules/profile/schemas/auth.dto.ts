import z from "zod";
import { ProfileZodSchema } from "../../../../../../../../libs/models/schemas/profile";
import { UserDTOZodSchema } from "../../../../../../../../libs/models/schemas/user";

export const ProfileDTOZodSchema = ProfileZodSchema.pick({
	name: true,
	// avatar: true,
	about: true,
	country_code: true,
}).extend({
	avatar: z.instanceof(FileList),
});
export type ProfileDTO = z.infer<typeof ProfileDTOZodSchema>;

export const AuthDTOZodSchema = z.object({
	auth: UserDTOZodSchema,
	profile: ProfileDTOZodSchema,
});
export type AuthDTO = z.infer<typeof AuthDTOZodSchema>;
