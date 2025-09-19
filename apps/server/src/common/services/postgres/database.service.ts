import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { DatabaseKysely } from './database.type';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '../config/config.service';
import { inject, injectable } from 'inversify';
import { COMMON_TYPES } from '../../../web-server/container/TYPES.di';

@injectable()
export class DatabaseService {
	db: Kysely<DatabaseKysely>;

	constructor(
		@inject(COMMON_TYPES.services.logger)
		private readonly loggerService: LoggerService,
		@inject(COMMON_TYPES.services.config)
		private readonly configService: ConfigService,
	) {
		const logger = this.loggerService.logger;
		const pool = new Pool({
			database: this.configService.getEnv('DB_NAME'),
			host: this.configService.getEnv('DB_HOST'),
			user: this.configService.getEnv('DB_USER'),
			port: parseInt(this.configService.getEnv('DB_PORT')),
			password: this.configService.getEnv('DB_PASSWORD'),
			// max: 10,
		});

		pool.on('connect', () => logger.info('POSTGRES CONNECT'));
		pool.on('acquire', () => logger.info('POSTGRES ACQUIRE'));
		pool.on('error', error => logger.error({ POSTGRES_ERROR: error }));
		pool.on('release', () => logger.info('POSTGRES RELEASE'));

		const dialect = new PostgresDialect({ pool });

		this.db = new Kysely<DatabaseKysely>({ dialect });
	}

	disconnect = async () => {
		await this.db.destroy();
		this.loggerService.logger.info('POSTGRES DISCONNECT');
	};
}
