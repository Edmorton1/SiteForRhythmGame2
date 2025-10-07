export const AUTH = {
	repositories: {
		auth: Symbol.for('AuthRepository'),
		registration: Symbol.for('RegistrationRepository'),
	},
} as const;
