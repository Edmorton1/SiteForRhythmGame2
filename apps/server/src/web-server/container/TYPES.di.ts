import { SERVICES_TYPES } from '../../common/containers/SERVICES_TYPES.di';

export const COMMON_TYPES = {
	services: { ...SERVICES_TYPES },

	app: {
		ServerRoutes: Symbol.for('ServerRoutes'),
		ExpressError: Symbol.for('ErrorMiddleware'),
		ExpressSession: Symbol.for('ExpressSession'),
		ServerExpress: Symbol.for('ServerExpress'),
	},

	controllers: {},
};
