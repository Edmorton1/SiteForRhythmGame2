export const TYPES = {
	services: {
		config: Symbol.for("ConfigService"),
		token: Symbol.for("TokenService"),
		crypto: Symbol.for("CryptoService"),
		logger: Symbol.for("LoggerService"),
		database: Symbol.for("Database"),
	},

	app: {
		ServerRoutes: Symbol.for("ServerRoutes"),
		ExpressError: Symbol.for("ErrorMiddleware"),
		ServerExpress: Symbol.for("ServerExpress"),
	},

	modules: {
		registration: {
			controller: Symbol.for("RegistrationController"),
			service: Symbol.for("RegistrationService"),
			repository: Symbol.for("RegistrationRepository"),
		},
		auth: {
			controller: Symbol.for("AuthController"),
			service: Symbol.for("AuthService"),
			repository: Symbol.for("AuthRepository"),
		},
	},
};
