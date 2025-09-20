export const AUTH_FUNCTIONS = {
	login: 'login',
	getProfileById: 'getProfileById',
	registration: 'registration',
	getUserId: 'getUserId',
} as const;

export const AUTH_MICRO_TYPES = {
	repositories: {
		auth: Symbol.for('AuthRepository'),
		registration: Symbol.for('RegistrationRepository'),
	},
} as const;
