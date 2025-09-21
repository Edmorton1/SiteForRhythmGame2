export const WEB_TYPES = {
	app: {
		ServerRoutes: Symbol.for('ServerRoutes'),
		ExpressError: Symbol.for('ErrorMiddleware'),
		ExpressSession: Symbol.for('ExpressSession'),
		ServerExpress: Symbol.for('ServerExpress'),
	},

	oauth: {
		PassportGoogle: Symbol.for('PassportGoogle'),
	},

	controllers: Symbol.for('HttpControllers'),
};
