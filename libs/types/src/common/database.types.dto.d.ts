import type { z } from "zod";
export declare const UserDTOZodSchema: z.ZodObject<
	{
		email: z.ZodNullable<z.ZodEmail>;
		password: z.ZodNullable<z.ZodString>;
	},
	z.core.$strip
>;
export type UserDTO = z.infer<typeof UserDTOZodSchema>;
