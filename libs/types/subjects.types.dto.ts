import type { z } from "zod";
import { UserZodSchema } from "./subjects.types";

export const UserDTOZodSchema = UserZodSchema.pick({
	email: true,
	password: true,
});
export type UserDTO = z.infer<typeof UserDTOZodSchema>;
