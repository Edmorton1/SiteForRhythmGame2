export const MICRO_TYPES = {
	app: {
		server: Symbol.for('ServerMicroservice'),
		composite: Symbol.for('ServiceComposite'),
		instance: Symbol.for('ServiceInstance'),
	},

	controllers: Symbol.for('MicroControllers'),
};
