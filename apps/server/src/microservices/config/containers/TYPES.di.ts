export const MICRO_TYPES = {
	app: {
		server: Symbol.for('ServerMicroservice'),
		baseServiceCollector: Symbol.for('ServiceCollector'),
		baseService: Symbol.for('ServiceInstance'),
		kafkaLoader: Symbol.for('KafkaLoader'),
		elasticLoader: Symbol.for('ElasticLoader'),
	},

	controllers: Symbol.for('MicroControllers'),
	elastics: Symbol.for('ElasticSearch'),
};
