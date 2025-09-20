import { SERVICES_TYPES } from '../../common/containers/SERVICES_TYPES.di';

export const WEB_TYPES = {
	services: { ...SERVICES_TYPES },

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
