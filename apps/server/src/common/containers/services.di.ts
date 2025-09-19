import { ContainerModule } from 'inversify';
import { WEB_TYPES } from '../../web-server/container/TYPES.di';
import { ConfigService } from '../services/config/config.service';
import { CryptoService } from '../services/crypto/crypto.service';
import { LoggerService } from '../services/logger/logger.service';
import { DatabaseService } from '../services/postgres/database.service';
import { RedisService } from '../services/redis/redis.service';
import { DbQueriesService } from '../services/dbQueries/dbQueries.service';
import { KafkaService } from '../services/kafka/kafka.service';
import { KafkaController } from '../services/kafka/kafka.controller';

export const serviceBindings = new ContainerModule(({ bind }) => {
	bind<ConfigService>(WEB_TYPES.services.config)
		.to(ConfigService)
		.inSingletonScope();
	bind<CryptoService>(WEB_TYPES.services.crypto)
		.to(CryptoService)
		.inSingletonScope();
	bind<LoggerService>(WEB_TYPES.services.logger)
		.to(LoggerService)
		.inSingletonScope();
	bind<DatabaseService>(WEB_TYPES.services.database)
		.to(DatabaseService)
		.inSingletonScope();
	bind<DbQueriesService>(WEB_TYPES.services.dbQueries)
		.to(DbQueriesService)
		.inSingletonScope();
	bind<RedisService>(WEB_TYPES.services.redis)
		.to(RedisService)
		.inSingletonScope();
	bind<KafkaService>(WEB_TYPES.services.kafka)
		.to(KafkaService)
		.inSingletonScope();
	bind<KafkaController>(WEB_TYPES.services.kafkaController)
		.to(KafkaController)
		.inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
});
