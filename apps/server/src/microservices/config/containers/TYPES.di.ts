import { SERVICES_TYPES } from '../../../common/containers/SERVICES_TYPES.di';

export const MICRO_TYPES = {
	services: { ...SERVICES_TYPES },

	app: {
		server: Symbol.for('ServerMicroservice'),
		composite: Symbol.for('ServiceComposite'),
		instance: Symbol.for('ServiceInstance'),
	},

	controllers: Symbol.for('MicroControllers'),
};
