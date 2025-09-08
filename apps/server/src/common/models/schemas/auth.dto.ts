import z from "zod";
import { zExpressMulterFile } from "../enums/enums";
import { UserDTOZodSchema } from "../../../../../../libs/models/schemas/user";
import { ProfileZodSchema } from "../../../../../../libs/models/schemas/profile";

const ProfileDTOZodSchema = ProfileZodSchema.pick({
	name: true,
	about: true,
	country_code: true,
});

export const AuthDTOZodSchema = z.object({
	user: UserDTOZodSchema,
	profile: ProfileDTOZodSchema,
	avatar: zExpressMulterFile.optional(),
});

export type AuthDTO = z.infer<typeof AuthDTOZodSchema>;

export const ProviderTokenZodSchema = z.object({
	providerId: z.string(),
});
