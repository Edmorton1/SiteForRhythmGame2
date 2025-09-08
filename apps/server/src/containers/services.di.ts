import { ContainerModule } from "inversify";
import { TokenService } from "../routes/registration/token.service";
import { TYPES } from "./TYPES";
import { ConfigService } from "../common/services/config/config.service";
import { CryptoService } from "../common/services/crypto/crypto.service";
import { LoggerService } from "../common/services/logger/logger.service";
import { DatabaseService } from "../common/services/postgres/database.service";

export const serviceBindings = new ContainerModule(({ bind }) => {
	bind<TokenService>(TYPES.services.token).to(TokenService).inSingletonScope();
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
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
	// bind<>(TYPES.services).to().inSingletonScope();
});
