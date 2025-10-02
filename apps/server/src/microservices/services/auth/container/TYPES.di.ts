export const AUTH_MICRO_TYPES = {
	repositories: {
		auth: Symbol.for('AuthRepository'),
		registration: Symbol.for('RegistrationRepository'),
	},
} as const;
