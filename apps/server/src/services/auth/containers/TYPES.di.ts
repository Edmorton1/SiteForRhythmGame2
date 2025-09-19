import { WEB_TYPES } from '../../../web-server/container/TYPES.di';

export const AUTH_TYPES = {
	...WEB_TYPES,
	// services: COMMON_TYPES.services,

	// app: COMMON_TYPES.app,

	oauth: {
		PassportGoogle: Symbol.for('PassportGoogleOauth'),
	},

	modules: {
		registration: {
			controller: Symbol.for('RegistrationController'),
			service: Symbol.for('RegistrationService'),
			repository: Symbol.for('RegistrationRepository'),
		},
		auth: {
			controller: Symbol.for('AuthController'),
			service: Symbol.for('AuthService'),
			repository: Symbol.for('AuthRepository'),
		},
		google: {
			controller: Symbol.for('GoogleController'),
			repository: Symbol.for('GoogleRepository'),
		},
	},
};
