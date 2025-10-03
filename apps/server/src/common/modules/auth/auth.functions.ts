import { LoginDTO } from '../../../../../../libs/models/schemas/auth';
// prettier-ignore
import { Profile, UserProfile } from '../../../../../../libs/models/schemas/profile';
import { Payload, Provider } from '../../_declarations/session';
import { RegistrationDTO } from '../../models/schemas/registration.dto';

export type LoginServiceReturn = {
	payload: Payload;
	profile: UserProfile;
};

export const AUTH_KEYS = {
	login: 'login',
	init: 'init',
	registration: 'registration',
	getUserId: 'getUserId',
} as const;

export type AUTH_FUNCTIONS = {
	[AUTH_KEYS.login]: { input: LoginDTO; output: LoginServiceReturn };
	[AUTH_KEYS.init]: { input: number; output: UserProfile };
	[AUTH_KEYS.registration]: {
		input: { authDTO: RegistrationDTO; provider: Provider | undefined };
		output: Profile;
	};
	[AUTH_KEYS.getUserId]: { input: string; output: number | undefined };
};
