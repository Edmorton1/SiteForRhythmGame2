export const SERVICES_TYPES = {
	config: Symbol.for('ConfigService'),
	crypto: Symbol.for('CryptoService'),
	logger: Symbol.for('LoggerService'),
	database: Symbol.for('DatabaseService'),
	redis: Symbol.for('RedisService'),
	dbQueries: Symbol.for('DbQueries'),
	// TODO: Переименовать
	kafka: Symbol.for('KafkaService'),
	kafkaController: Symbol.for('KafkaController'),
};
