import { z } from "zod";
declare const rolesZodSchema: z.ZodEnum<{
	user: "user";
	admin: "admin";
}>;
export type Role = z.infer<typeof rolesZodSchema>;
export declare const UserZodSchema: z.ZodObject<
	{
		id: z.ZodNumber;
		role: z.ZodEnum<{
			user: "user";
			admin: "admin";
		}>;
		email: z.ZodNullable<z.ZodEmail>;
		provider_id: z.ZodNullable<z.ZodString>;
		password: z.ZodNullable<z.ZodString>;
		banned: z.ZodDefault<z.ZodBoolean>;
	},
	z.core.$strip
>;
export type User = z.infer<typeof UserZodSchema>;
export interface Database {
	users: User;
}
export {};
