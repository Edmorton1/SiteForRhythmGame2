import { z } from 'zod';
import { zid, zISOString } from '../enums/zod';

export const ProfileZodSchema = z.object({
	id: zid,
	name: z.string().max(32).nonempty(),
	// У Client и Server будут свои DTO's
	avatar: z.string().nullable(),
	// TODO: Поле не должно быть пустым, но оно не обязательно
	about: z.string().max(512).nonempty().nullable(),
	country_code: z.string().length(2),
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
