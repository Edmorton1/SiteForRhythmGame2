export const registrationErrors = {
	EMAIL_TAKEN: 'An account with this email already exists',
	NICKNAME_TAKEN: 'This nickname is already taken',
	AUTH_METHOD:
		"There can't be a token, email and password at the same time, choose one authorization method",
} as const;
