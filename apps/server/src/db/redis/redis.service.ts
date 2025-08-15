import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PinoLogger } from "nestjs-pino";
import Redis from "ioredis";

@Injectable()
export class RedisService {
	private client: Redis;

	constructor(
		private readonly configService: ConfigService,
		private readonly logger: PinoLogger,
	) {
		this.client = new Redis({
			host: this.configService.getOrThrow("REDIS_HOST"),
			port: this.configService.getOrThrow("REDIS_PORT"),
			connectTimeout: 15000,
		});
		this.setLogs();
	}

	// async connect(): Promise<void> {
	// 	await this.client.connect();
	// }

	public async disconnect(): Promise<void> {
		await this.client.disconnect();
	}

	public get(key: string): Promise<string | null> {
		return this.client.get(key);
	}

	public set(key: string, value: number | string): void {
		void this.client.set(key, value);
	}

	private setLogs() {
		this.client.on("error", err => this.logger.error("REDIS ERROR", err));
		this.client.on("connect", () => this.logger.info("REDIS CONNECTED"));
		this.client.on("ready", () => this.logger.info("REDIS READY"));
		this.client.on("end", () => this.logger.info("REDIS DISCONNECTED"));
	}
}
