import { ContainerModule } from 'inversify';
import { ADAPTERS } from './adapters.types';
import { ConfigAdapter } from '../config/config.adapter';
import { LoggerAdapter } from '../logger/logger.adapter';
import { KafkaAdapter } from '../kafka/kafka.adapter';
import { RedisAdapter } from '../redis/redis.adapter';

export const adaptersBindings = new ContainerModule(({ bind }) => {
	bind<ConfigAdapter>(ADAPTERS.common.config)
		.to(ConfigAdapter)
		.inSingletonScope();

	bind<LoggerAdapter>(ADAPTERS.common.logger)
		.to(LoggerAdapter)
		.inSingletonScope();

	bind<KafkaAdapter>(ADAPTERS.common.kafka).to(KafkaAdapter).inSingletonScope();

	bind<RedisAdapter>(ADAPTERS.common.redis).to(RedisAdapter).inSingletonScope();

	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
});
