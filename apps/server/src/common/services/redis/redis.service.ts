import { inject, injectable } from 'inversify';
import { LoggerService } from '../logger/logger.service';
import { COMMON_TYPES } from '../../../containers/TYPES.di';
import { ConfigService } from '../config/config.service';
import { RedisStore } from './redis.store';
import Redis from 'ioredis';

@injectable()
export class RedisService {
	private readonly client: Redis;
	readonly store: RedisStore;

	constructor(
		@inject(COMMON_TYPES.services.logger)
		private readonly loggerService: LoggerService,
		@inject(COMMON_TYPES.services.config)
		private readonly configService: ConfigService,
	) {
		this.client = new Redis({
			host: this.configService.getEnv('REDIS_HOST'),
			port: parseInt(this.configService.getEnv('REDIS_PORT')),
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
			this.loggerService.logger.error({ REDIS_ERROR: err }),
		);
		this.client.on('connect', () =>
			this.loggerService.logger.info('REDIS CONNECTED'),
		);
		this.client.on('ready', () =>
			this.loggerService.logger.info('REDIS READY'),
		);
		this.client.on('end', () =>
			this.loggerService.logger.info('REDIS DISCONNECTED'),
		);
	}
}
