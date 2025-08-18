import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PinoLogger } from "nestjs-pino";
import { DatabaseKysely } from "@apps/server/db/postgres/database.type";

@Injectable()
export class DatabaseService {
	public db: Kysely<DatabaseKysely>;

	constructor(
		private readonly configService: ConfigService,
		private readonly logger: PinoLogger,
	) {
		const pool = new Pool({
			database: configService.getOrThrow("DB_NAME"),
			host: this.configService.getOrThrow("DB_HOST"),
			user: this.configService.getOrThrow("DB_USER"),
			port: this.configService.getOrThrow("DB_PORT"),
			password: this.configService.getOrThrow("DB_PASSWORD"),
			// max: 10,
		});

		pool.on("connect", () => this.logger.info("POSTGRES CONNECT"));
		pool.on("acquire", () => this.logger.info("POSTGRES ACQUIRE"));
		pool.on("error", error => this.logger.error({ POSTGRES_ERROR: error }));
		pool.on("release", () => this.logger.info("POSTGRES RELEASE"));

		const dialect = new PostgresDialect({ pool });

		this.db = new Kysely<DatabaseKysely>({ dialect });
	}
}
