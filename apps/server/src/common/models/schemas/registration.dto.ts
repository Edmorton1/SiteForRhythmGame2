import { ProfileZodSchema } from '../../../../../../libs/models/schemas/profile';
import { UserDTOZodSchema } from '../../../../../../libs/models/schemas/user';
import { zExpressMulterFile } from '../enums/enums';
import z from 'zod';

const ProfileDTOZodSchema = ProfileZodSchema.pick({
	name: true,
	about: true,
	country_code: true,
});

export const RegistrationDTOZodSchema = z.object({
	user: UserDTOZodSchema,
	profile: ProfileDTOZodSchema,
	avatar: zExpressMulterFile.optional(),
});

export type RegistrationDTO = z.infer<typeof RegistrationDTOZodSchema>;
