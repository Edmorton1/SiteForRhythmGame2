export const WEB = {
	app: {
		ControllerCollector: Symbol.for('ControllersCollector'),
		errorMiddleware: Symbol.for('errorMiddleware'),
		sessionMiddleware: Symbol.for('sessionMiddleware'),
		ServerWeb: Symbol.for('ServerWeb'),
		KafkaLoader: Symbol.for('KafkaLoader'),
	},

	oauth: {
		PassportGoogle: Symbol.for('PassportGoogle'),
	},

	controllers: Symbol.for('HttpControllers'),
};
