import z from 'zod';
import { zEmailPassword } from './user';

export const LoginDTOZodSchema = z.object(zEmailPassword);
export type LoginDTO = z.infer<typeof LoginDTOZodSchema>;
