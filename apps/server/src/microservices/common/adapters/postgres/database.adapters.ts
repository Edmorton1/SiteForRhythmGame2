import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { DatabaseKysely } from './database.type';
import { LoggerAdapter } from '../../../../common/adapters/logger/logger.adapter';
import { ConfigAdapter } from '../../../../common/adapters/config/config.adapter';
import { inject, injectable } from 'inversify';
import { ADAPTERS } from '../../../../common/adapters/container/adapters.types';

@injectable()
export class DatabaseAdapter {
	db: Kysely<DatabaseKysely>;

	constructor(
		@inject(ADAPTERS.common.logger)
		private readonly logger: LoggerAdapter,
		@inject(ADAPTERS.common.config)
		private readonly config: ConfigAdapter,
	) {
		const pool = new Pool({
			database: this.config.getEnv('DB_NAME'),
			host: this.config.getEnv('DB_HOST'),
			user: this.config.getEnv('DB_USER'),
			port: parseInt(this.config.getEnv('DB_PORT')),
			password: this.config.getEnv('DB_PASSWORD'),
			// max: 10,
		});

		pool.on('connect', () => this.logger.logger.info('POSTGRES CONNECT'));
		pool.on('acquire', () => this.logger.logger.info('POSTGRES ACQUIRE'));
		pool.on('error', error =>
			this.logger.logger.error({ POSTGRES_ERROR: error }),
		);
		pool.on('release', () => this.logger.logger.info('POSTGRES RELEASE'));

		const dialect = new PostgresDialect({ pool });

		this.db = new Kysely<DatabaseKysely>({ dialect });
	}

	disconnect = async () => {
		await this.db.destroy();
		this.logger.logger.info('POSTGRES DISCONNECT');
	};
}
