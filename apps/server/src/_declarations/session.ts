import "express-session";
import { Payload } from "../common/models/schemas/auth.dto";

declare module "express-session" {
	interface SessionData {
		payload?: Payload;
		provider_id?: string | undefined;
	}
}
