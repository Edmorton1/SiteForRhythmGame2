export const SERVICES_TYPES = {
	config: Symbol.for('ConfigService'),
	logger: Symbol.for('LoggerService'),
	database: Symbol.for('DatabaseService'),
	redis: Symbol.for('RedisService'),
	// TODO: Переименовать
	kafka: Symbol.for('KafkaService'),
	kafkaController: Symbol.for('KafkaController'),
};
