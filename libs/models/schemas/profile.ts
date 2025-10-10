import { z } from 'zod';
import { zId, zISOString } from '../enums/zod';
import { zCountryCode } from '../enums/countries';

export const ProfileZodSchema = z.object({
	id: zId,
	name: z.string().max(32).nonempty(),
	// У Client и Server будут свои DTO's
	avatar: z.string().nullable(),
	about: z.string().max(512),
	country_code: zCountryCode,
	created_at: zISOString,
});

export type Profile = z.infer<typeof ProfileZodSchema>;

export const UserProfileZodSchemaClient = ProfileZodSchema.pick({
	id: true,
	name: true,
	avatar: true,
	country_code: true,
});

export type UserProfile = z.infer<typeof UserProfileZodSchemaClient>;
