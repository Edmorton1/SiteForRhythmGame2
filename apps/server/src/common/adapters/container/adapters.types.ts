export const ADAPTERS = {
	common: {
		config: Symbol.for('ConfigAdapter'),
		logger: Symbol.for('LoggerAdapter'),
		kafka: Symbol.for('KafkaAdapter'),
		redis: Symbol.for('RedisAdapter'),
	},

	web: {
		kafkaSender: Symbol.for('KafkaSender'),
	},

	micro: {
		database: Symbol.for('DatabaseAdapter'),
		elasticsearch: Symbol.for('ElasticSearchAdapter'),
	},
} as const;
