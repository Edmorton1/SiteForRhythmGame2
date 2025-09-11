import z from 'zod';
import { UserZodSchema } from '../../../../../../libs/models/schemas/user';

export const PayloadZodSchema = UserZodSchema.pick({
	id: true,
	role: true,
});
export type Payload = z.infer<typeof PayloadZodSchema>;
