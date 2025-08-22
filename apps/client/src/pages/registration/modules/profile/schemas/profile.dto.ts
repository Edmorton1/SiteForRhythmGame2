import z from "zod";
import { ProfileZodSchema } from "../../../../../../../../libs/models/schemas/profile";

export const ProfileDTOZodSchema = ProfileZodSchema.pick({
	name: true,
	// avatar: true,
	about: true,
	country_code: true,
}).extend({
	avatar: z.instanceof(FileList),
});
export type ProfileDTO = z.infer<typeof ProfileDTOZodSchema>;
