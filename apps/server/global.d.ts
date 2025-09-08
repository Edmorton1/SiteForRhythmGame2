// types/express-session.d.ts
import "express-session";
import { Role } from "../../libs/models/schemas/user";

declare module "express-session" {
	interface SessionData {
		payload?: {
			id: number;
			role: Role;
		};
	}
}
