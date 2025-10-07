import { inject, injectable } from 'inversify';
import { LoggerAdapter } from '../logger/logger.adapter';
import { ConfigAdapter } from '../config/config.adapter';
import { RedisStore } from './redis.store';
import Redis from 'ioredis';
import { ADAPTERS } from '../container/adapters.types';

@injectable()
export class RedisAdapter {
	private readonly client: Redis;
	readonly store: RedisStore;

	constructor(
		@inject(ADAPTERS.common.logger)
		private readonly logger: LoggerAdapter,
		@inject(ADAPTERS.common.config)
		private readonly config: ConfigAdapter,
	) {
		this.client = new Redis({
			host: this.config.getEnv('REDIS_HOST'),
			port: parseInt(this.config.getEnv('REDIS_PORT')),
			connectTimeout: 15000,
		});

		this.store = new RedisStore({
			client: this.client,
			prefix: 'session-',
		});

		this.setLogs();
	}

	async disconnect(): Promise<void> {
		await this.client.quit();
	}

	async get(key: string): Promise<string | null> {
		return await this.client.get(key);
	}

	set(key: string, value: number | string): void {
		void this.client.set(key, value);
	}

	private setLogs() {
		this.client.on('error', err =>
			this.logger.logger.error({ REDIS_ERROR: err }),
		);
		this.client.on('connect', () => this.logger.logger.info('REDIS CONNECTED'));
		this.client.on('ready', () => this.logger.logger.info('REDIS READY'));
		this.client.on('end', () => this.logger.logger.info('REDIS DISCONNECTED'));
	}
}
