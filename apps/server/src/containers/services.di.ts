import { ContainerModule } from 'inversify';
import { COMMON_TYPES } from './TYPES.di';
import { ConfigService } from '../common/services/config/config.service';
import { CryptoService } from '../common/services/crypto/crypto.service';
import { LoggerService } from '../common/services/logger/logger.service';
import { DatabaseService } from '../common/services/postgres/database.service';
import { RedisService } from '../common/services/redis/redis.service';
import { DbQueriesService } from '../common/services/dbQueries/dbQueries.service';
import { KafkaService } from '../common/services/kafka/kafka.service';
import { KafkaController } from '../config/kafka.controller';

// TODO: ДУБЛИРОВАНИЕ УБРАТЬ
interface Ids {
	requestTopicId: string;
	responseTopicId: string;
	groupId: string;
}

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

	bind<(options: Ids) => KafkaController>(
		COMMON_TYPES.factories.kafka,
	).toFactory(context => {
		return (options: Ids) => {
			const kafkaService = context.get<KafkaService>(
				COMMON_TYPES.services.kafka,
			);
			return new KafkaController(kafkaService, options);
		};
	});
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
});
