export const MICRO_TYPES = {
	app: {
		server: Symbol.for('ServerMicroservice'),
		kafka: Symbol.for('KafkaMicroservice'),
		composite: Symbol.for('ServiceComposite'),
		instance: Symbol.for('ServiceInstance'),
		elastic: Symbol.for('ElasticLoading'),
	},

	controllers: Symbol.for('MicroControllers'),
	elastics: Symbol.for('ElasticSearch'),
};
