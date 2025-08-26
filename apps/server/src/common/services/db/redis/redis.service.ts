import Redis from "ioredis";
import { getEnv } from "../../../libs/func/env";
import { injectable } from "tsyringe";
import { LoggerService } from "../../logger/logger.service";

@injectable()
export class RedisService {
	private readonly client: Redis;

	constructor(private readonly loggerService: LoggerService) {
		this.client = new Redis({
			host: getEnv("REDIS_HOST"),
			port: parseInt(getEnv("REDIS_PORT")),
			connectTimeout: 15000,
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
		this.client.on("error", err =>
			this.loggerService.logger.error({ REDIS_ERROR: err }),
		);
		this.client.on("connect", () =>
			this.loggerService.logger.info("REDIS CONNECTED"),
		);
		this.client.on("ready", () =>
			this.loggerService.logger.info("REDIS READY"),
		);
		this.client.on("end", () =>
			this.loggerService.logger.info("REDIS DISCONNECTED"),
		);
	}
}
