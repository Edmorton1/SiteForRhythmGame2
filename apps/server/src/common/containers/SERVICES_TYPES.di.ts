export const SERVICES_TYPES = {
	config: Symbol.for('ConfigService'),
	logger: Symbol.for('LoggerService'),
	database: Symbol.for('DatabaseService'),
	redis: Symbol.for('RedisService'),
	kafka: Symbol.for('KafkaService'),
	elasticsearch: Symbol.for('ElasticSearchService'),
};
