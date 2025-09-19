import { ContainerModule } from 'inversify';
import { COMMON_TYPES } from '../../web-server/container/TYPES.di';
import { ConfigService } from '../services/config/config.service';
import { CryptoService } from '../services/crypto/crypto.service';
import { LoggerService } from '../services/logger/logger.service';
import { DatabaseService } from '../services/postgres/database.service';
import { RedisService } from '../services/redis/redis.service';
import { DbQueriesService } from '../services/dbQueries/dbQueries.service';
import { KafkaService } from '../services/kafka/kafka.service';

export const serviceBindings = new ContainerModule(({ bind }) => {
	bind<ConfigService>(COMMON_TYPES.services.config)
		.to(ConfigService)
		.inSingletonScope();
	bind<CryptoService>(COMMON_TYPES.services.crypto)
		.to(CryptoService)
		.inSingletonScope();
	bind<LoggerService>(COMMON_TYPES.services.logger)
		.to(LoggerService)
		.inSingletonScope();
	bind<DatabaseService>(COMMON_TYPES.services.database)
		.to(DatabaseService)
		.inSingletonScope();
	bind<DbQueriesService>(COMMON_TYPES.services.dbQueries)
		.to(DbQueriesService)
		.inSingletonScope();
	bind<RedisService>(COMMON_TYPES.services.redis)
		.to(RedisService)
		.inSingletonScope();
	bind<KafkaService>(COMMON_TYPES.services.kafka)
		.to(KafkaService)
		.inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
});
