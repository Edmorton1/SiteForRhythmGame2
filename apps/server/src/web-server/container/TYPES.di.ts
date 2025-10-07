export const WEB_TYPES = {
	app: {
		ControllerCollector: Symbol.for('ControllersCollector'),
		ExpressError: Symbol.for('ErrorMiddleware'),
		ExpressSession: Symbol.for('ExpressSession'),
		ServerExpress: Symbol.for('ServerExpress'),
		KafkaWebServer: Symbol.for('KafkaWebServer'),
	},

	oauth: {
		PassportGoogle: Symbol.for('PassportGoogle'),
	},

	controllers: Symbol.for('HttpControllers'),
};
