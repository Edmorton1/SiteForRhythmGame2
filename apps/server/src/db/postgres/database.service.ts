import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { Injectable } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import { DatabaseKysely } from "@apps/server/db/postgres/database.type";
import { getEnv } from "@server/libs/common/env";

@Injectable()
export class DatabaseService {
	db: Kysely<DatabaseKysely>;

	constructor(private readonly logger: PinoLogger) {
		const pool = new Pool({
			database: getEnv("DB_NAME"),
			host: getEnv("DB_HOST"),
			user: getEnv("DB_USER"),
			port: parseInt(getEnv("DB_PORT")),
			password: getEnv("DB_PASSWORD"),
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
