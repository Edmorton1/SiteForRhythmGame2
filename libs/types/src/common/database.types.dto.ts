import z from "zod";
import { UserZodSchema } from "./database.types";

export const UserDTOZodSchema = UserZodSchema.pick({
	email: true,
	password: true,
});
export type UserDTO = z.infer<typeof UserDTOZodSchema>;
