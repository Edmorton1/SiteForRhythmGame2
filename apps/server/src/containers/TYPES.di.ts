export const COMMON_TYPES = {
	services: {
		config: Symbol.for('ConfigService'),
		crypto: Symbol.for('CryptoService'),
		logger: Symbol.for('LoggerService'),
		database: Symbol.for('DatabaseService'),
		redis: Symbol.for('RedisService'),
		dbQueries: Symbol.for('DbQueries'),
		kafka: Symbol.for('KafkaInstance'),
	},

	factories: {
		kafka: Symbol.for('Factory<KafkaInstance>'),
	},

	app: {
		ServerRoutes: Symbol.for('ServerRoutes'),
		ExpressError: Symbol.for('ErrorMiddleware'),
		ExpressSession: Symbol.for('ExpressSession'),
		ServerExpress: Symbol.for('ServerExpress'),
	},
};
