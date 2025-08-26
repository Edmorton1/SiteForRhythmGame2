// prettier-ignore
import z from "zod";
import { zExpressMulterFile } from "../enums/enums";
import { UserDTOZodSchema } from "../../../../../../libs/models/schemas/user";
// prettier-ignore
import { Profile, ProfileZodSchema } from "../../../../../../libs/models/schemas/profile";
import { JwtPayload } from "jsonwebtoken";

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

export interface LoginResponse {
	token: string;
	profile: Profile;
}

export const ProviderTokenZodSchema = z.object({
	providerId: z.string(),
});

export interface ProviderJWTPayload
	extends z.infer<typeof ProviderTokenZodSchema>,
		JwtPayload {}
