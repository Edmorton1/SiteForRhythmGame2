import { ContainerModule } from 'inversify';
import { TYPES } from './TYPES';
import { ConfigService } from '../common/services/config/config.service';
import { CryptoService } from '../common/services/crypto/crypto.service';
import { LoggerService } from '../common/services/logger/logger.service';
import { DatabaseService } from '../common/services/postgres/database.service';
import { RedisService } from '../common/services/redis/redis.service';
import { DbQueriesService } from '../common/services/dbQueries/dbQueries.service';

export const serviceBindings = new ContainerModule(({ bind }) => {
	bind<ConfigService>(TYPES.services.config)
		.to(ConfigService)
		.inSingletonScope();
	bind<CryptoService>(TYPES.services.crypto)
		.to(CryptoService)
		.inSingletonScope();
	bind<LoggerService>(TYPES.services.logger)
		.to(LoggerService)
		.inSingletonScope();
	bind<DatabaseService>(TYPES.services.database)
		.to(DatabaseService)
		.inSingletonScope();
	bind<DbQueriesService>(TYPES.services.dbQueries)
		.to(DbQueriesService)
		.inSingletonScope();
	bind<RedisService>(TYPES.services.redis).to(RedisService).inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
});
