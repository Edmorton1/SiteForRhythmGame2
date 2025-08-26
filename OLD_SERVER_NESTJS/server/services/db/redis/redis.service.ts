import { Injectable } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import Redis from "ioredis";
import { getEnv } from "../../../libs/func/env";

@Injectable()
export class RedisService {
	private readonly client: Redis;

	constructor(private readonly logger: PinoLogger) {
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
		this.client.on("error", err => this.logger.error("REDIS ERROR", err));
		this.client.on("connect", () => this.logger.info("REDIS CONNECTED"));
		this.client.on("ready", () => this.logger.info("REDIS READY"));
		this.client.on("end", () => this.logger.info("REDIS DISCONNECTED"));
	}
}
