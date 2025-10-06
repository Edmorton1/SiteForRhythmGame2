import { ContainerModule } from 'inversify';
import { ConfigService } from '../services/config/config.service';
import { LoggerService } from '../services/logger/logger.service';
import { DatabaseService } from '../services/postgres/database.service';
import { RedisService } from '../services/redis/redis.service';
import { KafkaService } from '../services/kafka/kafka.service';
import { SERVICES_TYPES } from './SERVICES_TYPES.di';
import { ElasticSearchService } from '../services/elasticsearch/elasticsearch.service';

export const serviceBindings = new ContainerModule(({ bind }) => {
	bind<ConfigService>(SERVICES_TYPES.config)
		.to(ConfigService)
		.inSingletonScope();
	bind<LoggerService>(SERVICES_TYPES.logger)
		.to(LoggerService)
		.inSingletonScope();
	bind<DatabaseService>(SERVICES_TYPES.database)
		.to(DatabaseService)
		.inSingletonScope();

	bind<RedisService>(SERVICES_TYPES.redis).to(RedisService).inSingletonScope();

	bind<KafkaService>(SERVICES_TYPES.kafka).to(KafkaService).inSingletonScope();

	bind<ElasticSearchService>(SERVICES_TYPES.elasticsearch)
		.to(ElasticSearchService)
		.inSingletonScope();

	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
});
