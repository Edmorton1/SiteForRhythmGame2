export const MICRO = {
	app: {
		server: Symbol.for('ServerMicroservice'),
		baseServiceCollector: Symbol.for('ServiceCollector'),
		baseService: Symbol.for('ServiceInstance'),
		kafkaLoader: Symbol.for('KafkaLoader'),
		elasticLoading: Symbol.for('ElasticLoader'),
	},

	controllers: Symbol.for('MicroControllers'),
	elastics: Symbol.for('ElasticSearch'),
};
