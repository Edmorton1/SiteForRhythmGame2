export const TYPES = {
	services: {
		config: Symbol.for('ConfigService'),
		crypto: Symbol.for('CryptoService'),
		logger: Symbol.for('LoggerService'),
		database: Symbol.for('DatabaseService'),
		redis: Symbol.for('RedisService'),
	},

	oauth: {
		PassportGoogle: Symbol.for('PassportGoogleOauth'),
	},

	app: {
		ServerRoutes: Symbol.for('ServerRoutes'),
		ExpressError: Symbol.for('ErrorMiddleware'),
		ExpressSession: Symbol.for('ExpressSession'),
		ServerExpress: Symbol.for('ServerExpress'),
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
		},
	},
};
