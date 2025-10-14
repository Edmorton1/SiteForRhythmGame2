//prettier-ignore
import { UserZodSchema } from '../../../../../libs/models/schemas/user';
import 'express-session';
import z from 'zod';

export const PayloadZodSchema = UserZodSchema.pick({
	id: true,
	role: true,
});
export type Payload = z.infer<typeof PayloadZodSchema>;

// const ProviderZodSchema = z.object({
// 	id: z.string(),
// 	email: zEmailPassword.email,
// 	provider: z.string(),
// });
// export type Provider = z.infer<typeof ProviderZodSchema>;

export interface Provider {
	id: string;
	email: string;
	provider: string;
}

declare module 'express-session' {
	interface SessionData {
		payload?: Payload;
		provider?: Provider | undefined;
	}
}
