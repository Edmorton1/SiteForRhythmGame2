import 'express-session';
import { Payload } from '../common/models/schemas/auth.dto';

// export interface OauthUser {
// 	id: string;
// 	email: string;
// 	provider: 'google';
// }

declare module 'express-session' {
	interface SessionData {
		payload?: Payload;
		provider?:
			| {
					id: string;
					email: string;
					provider: string;
			  }
			| undefined;
	}
}

// declare global {
// 	namespace Express {
// 		interface User extends OauthUser {}
// 	}
// }
