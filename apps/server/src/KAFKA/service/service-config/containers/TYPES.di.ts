import { SERVICES_TYPES } from '../../../../containers/SERVICES_TYPES.di';

export const MICRO_TYPES = {
	...SERVICES_TYPES,

	app: {
		server: Symbol.for('ServerMicroservice'),
		composite: Symbol.for('ServiceComposite'),
		instance: Symbol.for('ServiceInstance'),
	},

	controllers: Symbol.for('MicroControllers'),
};
